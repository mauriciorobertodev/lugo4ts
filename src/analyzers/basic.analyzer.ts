import { AWAY_GOAL, HOME_GOAL } from "@/core/goal.js";
import { SPECS } from "@/core/specs.js";
import type { AnalyzedEvent, IAnalyzer } from "@/interfaces/analyzer.interface.js";
import type { BallObject } from "@/interfaces/ball.interface.js";
import type { GoalObject } from "@/interfaces/goal.interface.js";
import type { PlayerObject } from "@/interfaces/player.interface.js";
import type { PointObject } from "@/interfaces/positionable.interface.js";
import type { GameSnapshotObject } from "@/interfaces/snapshot.interface.js";
import type { BasicEventData } from "./basic.events.js";

type BallCollision = {
	side: "left" | "right" | "top" | "bottom";
	point: PointObject;
	normal: PointObject;
};

export class BasicAnalyzer implements IAnalyzer<BasicEventData> {
	private lastHolder: PlayerObject | null = null;
	private lastHolderTurn: number | null = null;
	private lastBallStoppedTurn: number | null = null;
	private lastIntensity: number = 0.5;
	private jumpingPlayers: Set<string> = new Set();
	private prevSnapshot: GameSnapshotObject | null = null;
	private events: AnalyzedEvent<BasicEventData>[] = [];

	public compute(current: GameSnapshotObject): AnalyzedEvent<BasicEventData>[] {
		this.events = [];

		if (!this.prevSnapshot) {
			this.prevSnapshot = current;
			return this.events;
		}

		const prev = this.prevSnapshot;

		if (!prev.ball || !current.ball) {
			this.prevSnapshot = current;
			return this.events; // Se não tiver bola, não tem o que analisar
		}

		// --- 1. LÓGICA DE POSSE (KICK, CATCH, PASS, INTERCEPTION) ---
		const prevHolder = prev.ball.holder;
		const currHolder = current.ball.holder;
		const prevBall = prev.ball;
		const currBall = current.ball;

		/**
		 * !ALERTA: Não podemos considerar a velocidade da bola quando tem um holder, pois ela ganha a velocidade e direção exatas do jogados no momento que é segurada.
		 * Por isso para saber se uma bola que foi pega no frame atual estava parada, precisamos verificar no frame anterior e não no atual, pois o atual ela já vai estar com a velocidade do jogador que pegou.
		 */

		/**
		 * QUANDO: a bola com holder passa a não ter mais holder.
		 *
		 * POSSIBILIDADES:
		 * - A. Alguém chutou a bola (kick)
		 * - B. Alguém soltou a bola sem chutar, ou seja, deixou ela cair (dropped)
		 */

		// lostHolder
		if (prevHolder && !currHolder) {
			this.withHolderToWithoutHolder(prev, current);
		}

		/**
		 * QUANDO: a bola sem holder passa a ter um holder.
		 *
		 * POSSIBILIDADES:
		 * - A. O Goleiro defendeu um chute (defense)
		 * - B. Alguém recebeu um passe (pass)
		 * - C. Alguém interceptou a bola (interception)
		 * - D. Alguém chutou a bola pra frente e pegou novamente (sem evento)
		 * - E. Alguém pegou a bola que estava parada (catch)
		 */
		// gainedHolder
		if (!prevHolder && currHolder) {
			this.withoutHolderToWithHolder(prev, current);
		}

		/**
		 * QUANDO: a bola com holder passa a ter outro holder.
		 *
		 * POSSIBILIDADES:
		 * - A. Alguém fez um passe curto a bola nem viajou só trocou de aliado (pass)
		 * - B. Alguém roubou a bola no corpo a corpo (steal)
		 */
		if (prevHolder && currHolder) {
			this.withHolderToWithHolder(prev, current);
		}

		/**
		 * QUANDO: a bola sem holder continua sem holder, mas sua direção muda de forma brusca.
		 *
		 * POSSIBILIDADES:
		 * - A. A bola bateu na parede (ball/wall)
		 * - B. A bola bateu na trave (ball/goalpost)
		 * - C. A bola só está viajando (sem eventos).
		 * - D. A bola parou completamente (ball/stopped)
		 */
		if (!prevHolder && !currHolder) {
			this.withoutHolderToWithoutHolder(prev, current);
		}

		/**
		 * QUANDO: o jogador está pulando ou não
		 *
		 * POSSIBILIDADES:
		 * - A. Está pulando (goalkeeper/jump)
		 * - B. Estava pulando e agora aterrissou (goalkeeper/land)
		 */
		this.jumps(current);

		/**
		 * Calcula e emite um evento de intensidade do jogo baseado na posição da bola, onde quanto mais próxima do centro do campo, mais intenso é o jogo,
		 * e quanto mais próxima das extremidades, menos intenso é o jogo.
		 */
		this.intensity(prevBall, currBall);

		this.prevSnapshot = current;

		if (currHolder) {
			this.lastHolder = currHolder;
			this.lastHolderTurn = current.turn;
		}

		if (currBall.velocity.speed <= SPECS.BALL_MIN_SPEED) {
			this.lastBallStoppedTurn = current.turn;
		}

		return this.events;
	}

	// Retorna um valor de intensidade entre 0 e 1 baseado na velocidade da bola comparada com a velocidade máxima
	private inverseLerp(value: number, min: number, max: number): number {
		return (value - min) / (max - min);
	}

	private sweepBallVsWalls(prevBall: BallObject, currBall: BallObject): BallCollision | null {
		const EPS = 0.1; // Margem para flutuações pequenas

		const prevDirection = prevBall.velocity.direction;
		const currDirection = currBall.velocity.direction;

		// 1. Detectar inversão de direção (produto das velocidades < 0 significa que mudou o sinal)
		const hitX = Math.sign(prevDirection.x) !== Math.sign(currDirection.x) && Math.abs(prevDirection.x - currDirection.x) > EPS;
		const hitY = Math.sign(prevDirection.y) !== Math.sign(currDirection.y) && Math.abs(prevDirection.y - currDirection.y) > EPS;

		if (!hitX && !hitY) return null;

		if (hitX) {
			// 2. Determinar qual parede foi baseada na posição atual
			// Se inverteu no X, ou bateu na esquerda ou na direita
			const side = currBall.position.x < SPECS.CENTER_X_COORDINATE ? "left" : "right";
			const targetX = side === "left" ? 0 : SPECS.MAX_X_COORDINATE;

			return {
				side,
				point: { x: targetX, y: currBall.position.y },
				normal: { x: side === "left" ? 1 : -1, y: 0 },
			};
		}

		if (hitY) {
			// Se inverteu no Y, ou bateu no topo ou no fundo
			const side = currBall.position.y < SPECS.MAX_Y_COORDINATE / 2 ? "bottom" : "top";
			const targetY = side === "bottom" ? 0 : SPECS.MAX_Y_COORDINATE;

			return {
				side,
				point: { x: currBall.position.x, y: targetY },
				normal: { x: 0, y: side === "bottom" ? 1 : -1 },
			};
		}

		return null;
	}
	/**
	 * Detecta se o ponto de colisão é próximo o suficiente das traves para ser considerado uma colisão com o gol, e retorna qual trave e qual lado se for o caso
	 */
	private isGoalpostCollision(point: PointObject): { goal: GoalObject; pole: "top" | "bottom" } | null {
		const MIN_TO_NEAR = SPECS.BALL_RADIUS + 1; // Distância mínima para considerar que está perto o suficiente para ser uma colisão com o gol, pode ser ajustada conforme necessário
		const distanceToStartField = Math.abs(point.x - SPECS.MIN_X_COORDINATE);
		const distanceToEndField = Math.abs(point.x - SPECS.MAX_X_COORDINATE);
		const isNearStartField = distanceToStartField < MIN_TO_NEAR; // Ajuste esse valor conforme necessário
		const isNearEndField = distanceToEndField < MIN_TO_NEAR; // Ajuste esse valor conforme necessário

		if (!isNearStartField && !isNearEndField) {
			return null; // Não está perto de nenhum gol
		}

		const distanceToTopPole = Math.abs(point.y - SPECS.GOAL_MAX_Y);
		const distanceToBottomPole = Math.abs(point.y - SPECS.GOAL_MIN_Y);
		const isNearTopPole = distanceToTopPole < MIN_TO_NEAR; // Ajuste esse valor conforme necessário
		const isNearBottomPole = distanceToBottomPole < MIN_TO_NEAR; // Ajuste esse valor conforme necessário

		if (!isNearTopPole && !isNearBottomPole) {
			return null; // Não está perto de nenhuma trave
		}

		return {
			goal: isNearStartField ? HOME_GOAL.toObject() : AWAY_GOAL.toObject(),
			pole: isNearTopPole ? "top" : "bottom",
		};
	}

	// LOGICA
	private intensity(prevBall: BallObject, curBall: BallObject): void {
		const currBallPos = curBall.position;
		const prevBallPos = prevBall.position;

		if (currBallPos.x === prevBallPos.x && currBallPos.y === prevBallPos.y) {
			return; // Se a bola não se moveu, não precisa recalcular a intensidade
		}

		// Vamos achar o ponto de intercessão entre a bola e a linha do gol;

		// O X do ponto de intercessão é o X do gol mais próximo da bola horizontalmente
		const X = currBallPos.x < SPECS.CENTER_X_COORDINATE ? SPECS.MIN_X_COORDINATE : SPECS.MAX_X_COORDINATE;
		// Caso a bola esteja verticalmente entre as traves, o ponto de intercessão é o Y da bola, caso contrário é o Y da trave mais próxima
		let Y = currBallPos.y;
		// Se a bola estiver acima da trave superior, o ponto de intercessão é o Y da trave superior
		if (Y < SPECS.GOAL_MIN_Y) Y = SPECS.GOAL_MIN_Y;
		// Se a bola estiver abaixo da trave inferior, o ponto de intercessão é o Y da trave inferior
		if (Y > SPECS.GOAL_MAX_Y) Y = SPECS.GOAL_MAX_Y;

		// Distância entre a bola e o ponto de intercessão na linha do gol mais próximo
		const distance = Math.sqrt((currBallPos.x - X) ** 2 + (currBallPos.y - Y) ** 2);
		/**
		 * Se nós queremos que a intensidade suba sempre que a bola se aproximar do gol.
		 * A distância máxima onde teriamos o menor risco para ambos os gols e consequêntemente a menor intensidade, seria a distância do centro do campo para a linha do gol,
		 * ou seja, a metade do campo, pois a partir disso a bola já estaria mais próxima de um gol do que do outro, e consequentemente o risco já começaria a aumentar.
		 */
		const maxDistance = SPECS.CENTER_X_COORDINATE;

		// Como sabemos que a distância atual, a min e a max, usamos o inverseLerp para calcular um valor entre 0 e 1, onde 0 é quando a bola está na linha do gol (distância 0) e 1 é quando a bola está na metade do campo ou mais longe (distância >= maxDistance), e valores intermediários para distâncias entre 0 e maxDistance. Depois invertemos esse valor para que a intensidade seja maior quanto mais próxima do gol a bola estiver.
		const factor = this.inverseLerp(distance, 0, maxDistance);

		// Invertendo para que a intensidade seja maior quanto mais próxima do gol a bola estiver
		const intensity = 1 - factor;

		if (this.lastIntensity !== intensity) {
			this.lastIntensity = intensity;
			this.events.push({
				event: "game:intensity",
				data: { intensity },
			});
		}
	}

	private jumps(curr: GameSnapshotObject): void {
		for (const player of curr.homeTeam?.players || []) {
			const key = `home-${player.number}`;

			if (player.isJumping) {
				if (!this.jumpingPlayers.has(key)) {
					this.events.push({
						event: "game:goalkeeper/jump",
						data: {
							goalkeeper: player,
							duration: SPECS.GOALKEEPER_JUMP_TURNS_DURATION,
							intensity: this.inverseLerp(player.velocity.speed, 0, SPECS.GOALKEEPER_JUMP_MAX_SPEED),
						},
					});
					this.jumpingPlayers.add(key);
				}
			}

			if (!player.isJumping) {
				if (this.jumpingPlayers.has(key)) {
					this.events.push({
						event: "game:goalkeeper/land",
						data: {
							goalkeeper: player,
						},
					});
					this.jumpingPlayers.delete(key);
				}
			}
		}
	}

	/** ANTES: bola sem holder -> AGORA: bola com holder */
	private withoutHolderToWithHolder(prevSnapshot: GameSnapshotObject, currSnapshot: GameSnapshotObject) {
		const currHolder = currSnapshot.ball!.holder!;
		const currBall = currSnapshot.ball!;

		const prevBallIsStopped = prevSnapshot.ball!.velocity.speed <= SPECS.BALL_MIN_SPEED;
		const currBallIntensity = this.inverseLerp(currBall.velocity.speed, SPECS.BALL_MIN_SPEED, SPECS.BALL_MAX_SPEED);

		/**
		 * Se a bola estava parada no frame anterior e alguém a pegou no frame atual, então é um catch (catch)
		 *
		 * POSSIBILIDADE: E
		 */
		if (prevBallIsStopped) {
			this.events.push({
				event: "game:catch",
				data: {
					catcher: currHolder,
				},
			});
		}

		/**
		 * Se a bola não estava parada no frame anterior e o holder atual é goleiro, então é uma defesa (defense)
		 *
		 * POSSIBILIDADE: A
		 */
		if (!prevBallIsStopped && currHolder.number === SPECS.GOALKEEPER_NUMBER) {
			this.events.push({
				event: "game:defense",
				data: {
					defender: currHolder,
					intensity: currBallIntensity,
				},
			});
		}

		/**
		 * Se a bola não estava parada no frame anterior e alguém a pegou no frame atual, e não foi o goleiro que pegou a bola.
		 *
		 * POSSIBILIDADES:
		 * - B. Alguém recebeu um passe (pass)
		 * - C. Alguém interceptou a bola (interception)
		 * - D. Alguém chutou a bola pra frente e pegou novamente (sem evento)
		 */
		if (!prevBallIsStopped && currHolder.number !== SPECS.GOALKEEPER_NUMBER) {
			const alreadyTouched = this.lastHolder && this.lastHolderTurn;
			const ballStoppedSinceLastTouch = this.lastBallStoppedTurn && this.lastHolderTurn && this.lastBallStoppedTurn > this.lastHolderTurn;

			/**
			 * Se alguém já tocou na bola antes, e a bola ainda não parou depois disso, e como alguém pegou agora, pode ser um passe ou uma interceptação
			 *
			 * POSSIBILIDADES:
			 * - B. Alguém recebeu um passe (pass)
			 * - C. Alguém interceptou a bola (interception)
			 * - D. Alguém chutou a bola pra frente e pegou novamente (sem evento)
			 */
			if (alreadyTouched && !ballStoppedSinceLastTouch) {
				const isSameSide = this.lastHolder!.side === currHolder.side;
				const isSamePlayer = isSameSide && this.lastHolder!.number === currHolder.number;

				/**
				 * Se o último holder é do mesmo time do atual e não é o mesmo player então é um passe.
				 *
				 * POSSIBILIDADE: B
				 */
				if (isSameSide && !isSamePlayer) {
					// PASSE - Forçado mas passe
					this.events.push({
						event: "game:pass",
						data: {
							kicker: this.lastHolder!,
							receiver: currHolder,
						},
					});
				}

				/**
				 * Se o último holder é o mesmo player do atual, então a bola foi chutada pra frente e ele pegou de novo, sem que ninguém mais tenha tocado, então não consideramos nenhum evento especial, pois pode ser só um movimento do jogador com a bola.
				 *
				 * POSSIBILIDADE: D
				 */
				if (isSamePlayer) {
				}

				/**
				 * Se o último holder é de um time diferente do atual, então é uma interceptação, alguém do time adversário pegou  a bola que havia sido chutada para alguém.
				 *
				 * POSSIBILIDADE: C
				 */
				if (!isSameSide) {
					this.events.push({
						event: "game:interception",
						data: {
							interceptor: currHolder,
							intercepted: this.lastHolder!,
						},
					});
				}
			}
		}
	}

	/** ANTES: bola com holder -> AGORA: bola sem holder */
	private withHolderToWithoutHolder(prevSnapshot: GameSnapshotObject, currSnapshot: GameSnapshotObject) {
		const prevHolder = prevSnapshot.ball!.holder!;

		const currBall = currSnapshot.ball!;

		const currBallIsStopped = currBall.velocity.speed <= SPECS.BALL_MIN_SPEED;
		const currBallIntensity = this.inverseLerp(currBall.velocity.speed, SPECS.BALL_MIN_SPEED, SPECS.BALL_MAX_SPEED);

		/**
		 * Se no frame anterior a bola tinha um holder, E no frame atual ela não tem mais holder, E não está parada -> ou seja, o jogador chutou a bola, então é um kick (kick)
		 *
		 * POSSIBILIDADE: A
		 */
		if (!currBallIsStopped) {
			this.events.push({
				event: "game:kick",
				data: {
					kicker: prevHolder,
					intensity: currBallIntensity,
				},
			});
		}

		/**
		 * Se no frame anterior a bola tinha um holder, e no frame atual ela não tem mais holder, e está parada, ou seja, o jogador só soltou ela sem chutar, então é um dropped (dropped)
		 *
		 * POSSIBILIDADE: B
		 */
		if (currBallIsStopped) {
			this.lastBallStoppedTurn = currSnapshot.turn;
			this.events.push({
				event: "game:ball/dropped",
				data: {
					dropper: prevHolder,
				},
			});
		}
	}

	/** ANTES: bola sem holder -> AGORA: bola sem holder */
	private withoutHolderToWithoutHolder(prevSnapshot: GameSnapshotObject, currSnapshot: GameSnapshotObject) {
		const prevBall = prevSnapshot.ball!;
		const currBall = currSnapshot.ball!;

		const prevBallIsStopped = prevBall.velocity.speed <= SPECS.BALL_MIN_SPEED;
		const currBallIsStopped = currBall.velocity.speed <= SPECS.BALL_MIN_SPEED;

		const collision = this.sweepBallVsWalls(prevBall, currBall);
		const intensity = this.inverseLerp(currBall.velocity.speed, SPECS.BALL_MIN_SPEED, SPECS.BALL_MAX_SPEED);

		/**
		 * QUANDO: a bola sem holder continua sem holder, mas sua direção muda de forma brusca.
		 *
		 * POSSIBILIDADES:
		 * - A. A bola bateu na parede (ball/wall)
		 * - B. A bola bateu na trave (ball/goalpost)
		 */
		if (collision) {
			const isGoalpost = this.isGoalpostCollision(collision.point);

			/**
			 * Se a colisão não foi próxima das traves, ou seja, foi na parede lateral ou de fundo.
			 *
			 * POSSIBILIDADE: A
			 */
			if (!isGoalpost) {
				this.events.push({
					event: "game:ball/wall",
					data: {
						side: collision.side,
						intensity,
					},
				});
			}

			/**
			 * Se a colisão foi próxima das traves de algum dos gols.
			 *
			 * POSSIBILIDADE: B
			 */
			if (isGoalpost) {
				this.events.push({
					event: "game:ball/goalpost",
					data: {
						goal: isGoalpost.goal,
						pole: isGoalpost.pole,
						intensity,
					},
				});
			}
		}

		/**
		 * Se antes a bola estava em movimento e agora a bola parou completamente, ou seja, sua velocidade chega a zero, então é um ball/stopped (ball/stopped)
		 *
		 * POSSIBILIDADE: D
		 */
		if (currBallIsStopped && !prevBallIsStopped) {
			this.lastBallStoppedTurn = currSnapshot.turn;
			this.events.push({
				event: "game:ball/stopped",
				data: null,
			});
		}
	}

	/** ANTES: bola com holder -> AGORA: bola com holder */
	private withHolderToWithHolder(prevSnapshot: GameSnapshotObject, currSnapshot: GameSnapshotObject) {
		const prevHolder = prevSnapshot.ball!.holder!;
		const currHolder = currSnapshot.ball!.holder!;

		const isSameTeam = prevHolder.side === currHolder.side;
		const isSamePlayer = isSameTeam && prevHolder.number === currHolder.number;

		/**
		 * Se o holder anterior é do mesmo time do holder atual, então é um passe
		 *
		 * POSSIBILIDADE: A
		 */
		if (isSameTeam && !isSamePlayer) {
			this.events.push({
				event: "game:pass",
				data: {
					kicker: prevHolder,
					receiver: currHolder,
				},
			});
		}

		/**
		 * Se o holder anterior é de um time diferente do holder atual, então é um roubo de bola (steal)
		 *
		 * POSSIBILIDADE: B
		 */
		if (!isSameTeam) {
			this.events.push({
				event: "game:steal",
				data: {
					thief: currHolder,
					victim: prevHolder,
				},
			});
		}
	}
}

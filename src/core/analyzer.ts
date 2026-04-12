import { SPECS } from "@/core/specs.js"; // Para saber limites do campo/velocidade
import type { BallObject } from "@/interfaces/ball.interface.js";
import type { EventData } from "@/interfaces/events.interface.js";
import type { GoalObject } from "@/interfaces/goal.interface.js";
import type { PlayerObject } from "@/interfaces/player.interface.js";
import type { PointObject } from "@/interfaces/positionable.interface.js";
import type { GameSnapshotObject } from "@/interfaces/snapshot.interface.js";
import { AWAY_GOAL, HOME_GOAL } from "./goal.js";

type AnalyzedEvent = {
	[K in keyof EventData]: {
		event: K;
		data: EventData[K];
	};
}[keyof EventData];

type BallCollision = {
	side: "left" | "right" | "top" | "bottom";
	point: PointObject;
	normal: PointObject;
	t: number;
};

export class Analyzer {
	private lastHolder: PlayerObject | null = null;
	private lastHolderTurn: number | null = null;
	private lastBallStoppedTurn: number | null = null;
	private prevSnapshot: GameSnapshotObject | null = null;
	private events: AnalyzedEvent[] = [];

	public compute(current: GameSnapshotObject): AnalyzedEvent[] {
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
		 * Intensidade da torcida baseada na posição da bola: quanto mais próximo do gol, mais intensa a torcida (0 a 1)
		 */
		this.events.push({
			event: "game:intensity",
			data: { intensity: this.calculateMatchIntensity(currBall) },
		});

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

	private sweepBallVsWalls(prev: BallObject, curr: BallObject): BallCollision | null {
		const dx = curr.position.x - prev.position.x;
		const dy = curr.position.y - prev.position.y;

		const EPS = 1e-6;

		const candidates: BallCollision[] = [];

		// 👉 LEFT
		if (Math.abs(dx) > EPS) {
			const t = (0 - prev.position.x) / dx;
			if (t >= 0 && t <= 1) {
				const y = prev.position.y + dy * t;
				if (y >= 0 && y <= SPECS.MAX_Y_COORDINATE) {
					candidates.push({
						side: "left",
						point: { x: 0, y },
						normal: { x: 1, y: 0 },
						t,
					});
				}
			}
		}

		// 👉 RIGHT
		if (Math.abs(dx) > EPS) {
			const t = (SPECS.MAX_X_COORDINATE - prev.position.x) / dx;
			if (t >= 0 && t <= 1) {
				const y = prev.position.y + dy * t;
				if (y >= 0 && y <= SPECS.MAX_Y_COORDINATE) {
					candidates.push({
						side: "right",
						point: { x: SPECS.MAX_X_COORDINATE, y },
						normal: { x: -1, y: 0 },
						t,
					});
				}
			}
		}

		// 👉 BOTTOM
		if (Math.abs(dy) > EPS) {
			const t = (0 - prev.position.y) / dy;
			if (t >= 0 && t <= 1) {
				const x = prev.position.x + dx * t;
				if (x >= 0 && x <= SPECS.MAX_X_COORDINATE) {
					candidates.push({
						side: "bottom",
						point: { x, y: 0 },
						normal: { x: 0, y: 1 },
						t,
					});
				}
			}
		}

		// 👉 TOP
		if (Math.abs(dy) > EPS) {
			const t = (SPECS.MAX_Y_COORDINATE - prev.position.y) / dy;
			if (t >= 0 && t <= 1) {
				const x = prev.position.x + dx * t;
				if (x >= 0 && x <= SPECS.MAX_X_COORDINATE) {
					candidates.push({
						side: "top",
						point: { x, y: SPECS.MAX_Y_COORDINATE },
						normal: { x: 0, y: -1 },
						t,
					});
				}
			}
		}

		if (candidates.length === 0) return null;

		// 🔥 pega a colisão MAIS PRÓXIMA (menor t)
		return candidates.reduce((closest, c) => (c.t < closest.t ? c : closest));
	}
	/**
	 * Detecta se o ponto de colisão é próximo o suficiente das traves para ser considerado uma colisão com o gol, e retorna qual trave e qual lado se for o caso
	 */
	private isGoalpostCollision(point: PointObject): { goal: GoalObject; pole: "top" | "bottom" } | null {
		const MIN_TO_NEAR = 0.5;
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

	private calculateMatchIntensity(curBall: BallObject): number {
		// Exemplo: intensidade baseada na distância da bola até o gol mais próximo
		const ballX = curBall.position.x;
		const distToGoalA = Math.abs(ballX - 0);
		const distToGoalB = Math.abs(ballX - SPECS.MAX_X_COORDINATE);
		const minPulse = Math.min(distToGoalA, distToGoalB);

		// Quanto menor a distância, maior a intensidade (0 a 1)
		return 1 - minPulse / (SPECS.MAX_X_COORDINATE / 2);
	}

	// LOGICA
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
					side: currHolder.side,
					player: currHolder.number,
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
					side: currHolder.side,
					player: currHolder.number,
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
							kicker: { side: this.lastHolder!.side, player: this.lastHolder!.number },
							receiver: { side: currHolder.side, player: currHolder.number },
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
							interceptor: { side: currHolder.side, player: currHolder.number },
							intercepted: { side: this.lastHolder!.side, player: this.lastHolder!.number },
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
				event: "game:shot",
				data: {
					side: prevHolder.side,
					player: prevHolder.number,
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
					side: prevHolder.side,
					player: prevHolder.number,
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
					kicker: { side: prevHolder.side, player: prevHolder.number },
					receiver: { side: currHolder.side, player: currHolder.number },
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
					thief: { side: currHolder.side, player: currHolder.number },
					victim: { side: prevHolder.side, player: prevHolder.number },
				},
			});
		}
	}
}

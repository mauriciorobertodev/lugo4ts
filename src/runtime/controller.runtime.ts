import { credentials } from "@grpc/grpc-js";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import type { Ball } from "@/core/ball.js";
import type { Environment } from "@/core/environment.js";
import type { Formation } from "@/core/formation.js";
import type { GameSnapshot } from "@/core/game-snapshot.js";
import type { Player } from "@/core/player.js";
import { Point } from "@/core/point.js";
import { Side } from "@/core/side.js";
import { SPECS } from "@/core/specs.js";
import type { Velocity } from "@/core/velocity.js";
import { BroadcastClient } from "@/generated/broadcast.client.js";
import type { GameEvent, GameSetup } from "@/generated/broadcast.js";
import { RemoteClient } from "@/generated/remote.client.js";
import { GameProperties } from "@/generated/remote.js";
import type { IAnalyzer } from "@/interfaces/analyzer.interface.js";
import type { IGameController, RetryConfig } from "@/interfaces/controller.interface.js";
import type { CombinedEvents, CoreEventData, GenericEventListener } from "@/interfaces/events.interface.js";
import { GameState } from "@/interfaces/game.interface.js";
import { ServerState } from "@/interfaces/snapshot.interface.js";
import {
	fromLugoGameOverReason,
	fromLugoGameSnapshot,
	fromLugoGameState,
	fromLugoPlayer,
	toLugoPlayer,
	toLugoPoint,
	toLugoShotClock,
	toLugoVelocity,
} from "@/lugo.js";
import { logger } from "@/utils/logger.utils.js";
// import { danger, debug, info, success, warn } from '@/utils/logger.js';
import { intToSide, sideToInt } from "@/utils/side.utils.js";

export class GameController<T = {}> implements IGameController {
	private uuid: string = crypto.randomUUID();

	private analyzer: IAnalyzer<T> | null = null;

	private remote: RemoteClient;
	private broadcast: BroadcastClient;

	private state: GameState = GameState.WAITING;
	private snapshot: GameSnapshot | null = null;

	private attempts = 0;
	private retryTimer: NodeJS.Timeout | null = null;

	private listeners: { [K in keyof CombinedEvents<T>]?: ((data: CombinedEvents<T>[K]) => void)[] } = {};
	private listener: GenericEventListener<T> | null = null;

	constructor(serverAddress: string) {
		const transport = new GrpcTransport({
			host: serverAddress,
			channelCredentials: credentials.createInsecure(),
			clientOptions: {
				"grpc.primary_user_agent": `controller/${this.uuid}`,
			},
		});

		this.remote = new RemoteClient(transport);
		this.broadcast = new BroadcastClient(transport);
	}

	public getState(): GameState {
		return this.state;
	}

	public getSnapshot(): GameSnapshot | null {
		return this.snapshot;
	}

	public async setTeamFormation(side: Side, formation: Formation): Promise<GameSnapshot> {
		let snapshot: GameSnapshot | null = null;
		await Promise.all(
			Object.entries(formation.toArray()).map(async ([number, position]) => {
				const call = await this.remote.setPlayerProperties({
					number: parseInt(number, 10),
					side: sideToInt(side),
					position: toLugoPoint(position),
				});

				if (call.response.gameSnapshot) {
					console.debug(`[CONTROLLER] ✅ Posição do jogador ${number} do lado ${side} definida para (${position.getX()}, ${position.getY()})`);
					snapshot = fromLugoGameSnapshot(call.response.gameSnapshot);
				} else {
					logger.error(`[CONTROLLER] ❌ Erro ao definir posição do jogador ${number} do lado ${side}`);
				}
			}),
		);
		return snapshot!;
	}

	public async setHomeTeamFormation(formation: Formation): Promise<GameSnapshot> {
		return this.setTeamFormation(Side.HOME, formation);
	}

	public async setAwayTeamFormation(formation: Formation): Promise<GameSnapshot> {
		return this.setTeamFormation(Side.AWAY, formation);
	}

	public async nextTurn(): Promise<GameSnapshot | null> {
		try {
			const call = await this.remote.nextTurn({});
			const lugoSnapshot = call.response.gameSnapshot;
			return lugoSnapshot ? fromLugoGameSnapshot(lugoSnapshot) : null;
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao avançar turno");
			console.error(error);
			throw error;
		}
	}

	public async nextOrder(): Promise<GameSnapshot | null> {
		try {
			const call = await this.remote.nextOrder({});
			const lugoSnapshot = call.response.gameSnapshot;
			return lugoSnapshot ? fromLugoGameSnapshot(lugoSnapshot) : null;
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao avançar ordem");
			console.error(error);
			throw error;
		}
	}

	public async play(): Promise<GameSnapshot | null> {
		try {
			const call = await this.remote.pauseOrResume({});
			const lugoSnapshot = call.response.gameSnapshot;
			return lugoSnapshot ? fromLugoGameSnapshot(lugoSnapshot) : null;
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao iniciar jogo");
			console.error(error);
			throw error;
		}
	}

	public async pause(): Promise<GameSnapshot | null> {
		return await this.play();
	}

	public async getGameSnapshot(): Promise<GameSnapshot | null> {
		try {
			const call = await this.remote.getGameSnapshot({});
			const lugoSnapshot = call.response.gameSnapshot;
			return lugoSnapshot ? fromLugoGameSnapshot(lugoSnapshot) : null;
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao obter snapshot do jogo");
			console.error(error);
			throw error;
		}
	}

	public async resetPlayerPositions(): Promise<GameSnapshot> {
		try {
			const res = await this.remote.resetPlayerPositions({});
			const lugoSnapshot = res.response.gameSnapshot;
			logger.debug("[CONTROLLER] ✅ Posições resetadas com sucesso");
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao resetar posições dos jogadores");
			console.error(error);
			throw error;
		}
	}

	public async resetBallPosition(): Promise<GameSnapshot> {
		return this.setBallPosition(new Point(SPECS.CENTER_X_COORDINATE, SPECS.CENTER_Y_COORDINATE));
	}

	public async addPlayer(player: Player): Promise<GameSnapshot> {
		try {
			const res = await this.remote.setPlayerProperties({
				number: player.getNumber(),
				side: sideToInt(player.getTeamSide()),
				position: toLugoPoint(player.getPosition()),
				velocity: toLugoVelocity(player.getVelocity()),
			});
			const lugoSnapshot = res.response.gameSnapshot;
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error(`[CONTROLLER] ❌ Erro definir jogador "${player.getNumber()}" do lado "${player.getTeamSide()}"`);
			console.error(error);
			throw error;
		}
	}

	public async setPlayerPosition(side: Side, number: number, position: Point): Promise<GameSnapshot> {
		try {
			const res = await this.remote.setPlayerProperties({
				number: number,
				side: sideToInt(side),
				position: toLugoPoint(position),
			});
			const lugoSnapshot = res.response.gameSnapshot;
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao definir posição do jogador");
			console.error(error);
			throw error;
		}
	}

	public async setPlayersPositions(positions: { side: Side; number: number; position: Point }[]): Promise<GameSnapshot> {
		try {
			for (const { side, number, position } of positions) {
				await this.remote.setPlayerProperties({
					number: number,
					side: sideToInt(side),
					position: toLugoPoint(position),
				});
			}

			const res = await this.remote.getGameSnapshot({});
			const lugoSnapshot = res.response.gameSnapshot;
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao definir posições dos jogadores");
			console.error(error);
			throw error;
		}
	}

	public async setPlayerVelocity(side: Side, number: number, velocity: Velocity): Promise<GameSnapshot> {
		try {
			const res = await this.remote.setPlayerProperties({
				number: number,
				side: sideToInt(side),
				velocity: toLugoVelocity(velocity),
			});
			const lugoSnapshot = res.response.gameSnapshot;
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao definir velocidade do jogador");
			console.error(error);
			throw error;
		}
	}

	public async setPlayerSpeed(side: Side, number: number, speed: number): Promise<GameSnapshot> {
		try {
			const res = await this.remote.setPlayerProperties({
				number: number,
				side: sideToInt(side),
				velocity: { speed },
			});
			const lugoSnapshot = res.response.gameSnapshot;
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao definir velocidade do jogador");
			console.error(error);
			throw error;
		}
	}

	public async setBall(ball: Ball): Promise<GameSnapshot> {
		try {
			const res = await this.remote.setBallProperties({
				position: toLugoPoint(ball.getPosition()),
				velocity: toLugoVelocity(ball.getVelocity()),
				holder: ball.getHolder() ? toLugoPlayer(ball.getHolder()!) : undefined,
			});
			const lugoSnapshot = res.response.gameSnapshot;
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao definir propriedades da bola");
			console.error(error);
			throw error;
		}
	}

	public async setBallPosition(position: Point): Promise<GameSnapshot> {
		try {
			const res = await this.remote.setBallProperties({ position: toLugoPoint(position) });
			const lugoSnapshot = res.response.gameSnapshot;
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao definir posição da bola");
			console.error(error);
			throw error;
		}
	}

	public async setBallVelocity(velocity: Velocity): Promise<GameSnapshot> {
		try {
			const res = await this.remote.setBallProperties({ velocity: toLugoVelocity(velocity) });
			const lugoSnapshot = res.response.gameSnapshot;
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao definir velocidade da bola");
			console.error(error);
			throw error;
		}
	}

	public async setBallSpeed(speed: number): Promise<GameSnapshot> {
		try {
			const res = await this.remote.setBallProperties({ velocity: { speed } });
			const lugoSnapshot = res.response.gameSnapshot;
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao definir velocidade da bola");
			console.error(error);
			throw error;
		}
	}

	public async resumeListeningPhase(): Promise<void> {
		try {
			await this.remote.resumeListeningPhase({});
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao resumir fase de escuta");
			console.error(error);
		}
	}

	public async connect(config?: RetryConfig): Promise<void> {
		try {
			const { responses } = this.broadcast.onEvent({ uuid: this.uuid });

			responses.onNext((_event) => {
				// console.log("[EVENT] Novo evento recebido next:", _event);
				// console.log('[EVENT]', event?.gameSnapshot?.turn, event?.event?.oneofKind);
			});

			responses.onMessage((event: GameEvent) => {
				switch (event.event?.oneofKind) {
					case "breakpoint": {
						this.state = GameState.PAUSED;

						const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;

						this.emit("game:paused", { snapshot: snapshot?.toObject() });

						break;
					}
					case "goal": {
						const side = intToSide(event.event.goal.side);
						const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;

						this.emit("game:goal", { side, snapshot: snapshot?.toObject() });

						break;
					}
					case "debugReleased": {
						this.state = GameState.PLAYING;

						const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;

						this.emit("game:playing", { snapshot: snapshot?.toObject() });

						break;
					}
					case "gameOver": {
						this.state = GameState.OVER;

						const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;
						const reason = fromLugoGameOverReason(event.event.gameOver.reason);

						this.emit("game:over", { snapshot: snapshot?.toObject(), reason });

						break;
					}
					case "newPlayer":
						if (event.event.newPlayer.player) {
							const player = fromLugoPlayer(event.event.newPlayer.player);
							const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;

							this.emit("game:joined", { player: player.toObject(), snapshot: snapshot?.toObject() });
						}

						break;
					case "lostPlayer":
						if (event.event.lostPlayer.player) {
							const player = fromLugoPlayer(event.event.lostPlayer.player);
							const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;

							this.emit("game:leaved", { player: player.toObject(), snapshot: snapshot?.toObject() });
						}

						break;
					case "stateChange": {
						const prevState = fromLugoGameState(event.event.stateChange.previousState);
						const newState = fromLugoGameState(event.event.stateChange.newState);
						const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;

						this.emit("game:changed", { prevState, newState, snapshot: snapshot?.toObject() });

						if (snapshot) this.capture(snapshot);

						break;
					}
					default:
						logger.warn(`[EVENT] Evento desconhecido: ${event.event?.oneofKind}`);
				}
			});

			responses.onError((err) => {
				logger.error("[EVENT] Erro no stream de eventos:");
				console.error(err);

				if (!(config?.auto ?? true)) {
					logger.error("[CONTROLLER] ❌ Erro ao conectar e auto-retry desativado, não tentando reconectar.");
					this.emit("connection:error", { error: err instanceof Error ? err.message : String(err) });
					return;
				}

				this.handleRetry(config);
			});

			responses.onComplete(() => {
				logger.warn("[EVENT] ⚠️ Stream finalizada.");
				this.emit("connection:ended", null);
			});

			logger.debug("[EVENT] ✅ Stream iniciado");
			this.emit("connection:started", {
				setup: await this.getGameSetup(),
				snapshot: (await this.getGameSnapshot())?.toObject(),
			});
		} catch (err) {
			if (!(config?.auto ?? true)) {
				logger.error("[CONTROLLER] ❌ Erro ao conectar e auto-retry desativado, não tentando reconectar.");
				this.emit("connection:error", { error: err instanceof Error ? err.message : String(err) });
				return;
			}

			this.handleRetry(config);
		}
	}

	private handleRetry(config?: RetryConfig) {
		const attempts = config?.attempts ?? Infinity;
		const delay = config?.delay ?? 5000;

		if (this.attempts >= attempts) {
			logger.error(`[CONTROLLER] Conexão perdida. Número máximo de tentativas (${attempts}) atingido, não tentando reconectar.`);
			this.emit("connection:error", { error: `Falha na conexão e número máximo de tentativas (${attempts}) atingido` });
			return;
		}

		let secondsLeft = delay / 1000;

		// Emite o evento inicial para o front já saber o tempo total
		this.emit("connection:retrying", {
			attempt: this.attempts,
			next: delay,
		});

		// Opcional: Um intervalo interno na lib que avisa o "tick" a cada segundo
		// Isso facilita pro front não ter que criar o próprio timer
		const ticker = setInterval(() => {
			secondsLeft--;
			this.emit("connection:tick", { left: secondsLeft });
			if (secondsLeft <= 0) clearInterval(ticker);
		}, 1000);

		this.retryTimer = setTimeout(() => this.connect(config), delay);
	}

	public retry(config?: RetryConfig) {
		if (this.retryTimer) {
			clearTimeout(this.retryTimer);
			this.retryTimer = null;
		}
		this.attempts++; // Opcional: contar como uma nova tentativa
		this.connect(config);
	}

	public async startGame(): Promise<GameSetup> {
		try {
			const call = await this.broadcast.startGame({ watcherUuid: this.uuid });
			logger.debug("[CONTROLLER] ✅ Jogo iniciado");
			return call.response;
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao iniciar jogo");
			console.error(error);
			throw error;
		}
	}

	public async getGameSetup(): Promise<GameSetup> {
		try {
			const call = await this.broadcast.getGameSetup({ uuid: this.uuid });
			logger.debug("[GAME SETUP] ✅ Recebido");
			return call.response;
		} catch (error) {
			logger.error("[GAME SETUP] ❌ Erro ao obter configuração do jogo");
			console.error(error);
			throw error;
		}
	}

	public onEvent(listener: GenericEventListener) {
		this.listener = listener;
	}

	public on<K extends keyof CombinedEvents>(event: K, callback: (data: CombinedEvents[K]) => void) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event]?.push(callback);
	}

	public async applyEnvironment(environment: Environment): Promise<GameSnapshot> {
		try {
			logger.debug(`[CONTROLLER] 🚀 Aplicando ambiente "${environment.getName()}"...`);

			const ball = environment.getBall();
			const homeTeam = environment.getHomePlayers();
			const awayTeam = environment.getAwayPlayers();
			const homeScore = environment.getHomeTeam()?.getScore();
			const awayScore = environment.getAwayTeam()?.getScore();
			const turn = environment.getTurn();

			if (ball) {
				await this.setBall(ball);
				logger.debug("[CONTROLLER] ⚽️ Bola definida.");
			}

			if (homeTeam) {
				for (const player of homeTeam) {
					await this.addPlayer(player);
					logger.debug(`[CONTROLLER] 🏃 Jogador HOME ${player.getNumber()} definido.`);
				}
			}

			if (awayTeam) {
				for (const player of awayTeam) {
					await this.addPlayer(player);
					logger.debug(`[CONTROLLER] 🏃 Jogador AWAY ${player.getNumber()} definido.`);
				}
			}

			await this.remote.setGameProperties({
				turn: turn ?? 0,
				homeScore: homeScore ?? 0,
				awayScore: awayScore ?? 0,
				frameInterval: BigInt(0),
				shotClock: environment.getShotClock() ? toLugoShotClock(environment.getShotClock()!) : undefined,
			});

			const snapshot = await this.getGameSnapshot();

			logger.debug("[CONTROLLER] ✅ Ambiente aplicado com sucesso");
			logger.debug(`########################################################`);

			return snapshot!;
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao aplicar ambiente");
			console.error(error);
			throw error;
		}
	}

	public async setTurn(turn: number): Promise<GameSnapshot> {
		try {
			const properties = GameProperties.create();
			const res = await this.remote.setGameProperties({ ...properties, turn });
			const lugoSnapshot = res.response.gameSnapshot;
			return fromLugoGameSnapshot(lugoSnapshot!);
		} catch (error) {
			logger.error(`[CONTROLLER] Erro ao definir turno como ${turn}:`);
			console.error(error);
			throw error;
		}
	}

	// PRIVATE METHODS

	private capture(snapshot: GameSnapshot) {
		// TODO: implementar captura de estado para permitir funcionalidades como replay, rewind, etc.
		// TODO: comparar a snapshot nova com a atual para emitir eventos de mudança de estado (ex: gol, mudança de posse, etc.)

		if (this.state === GameState.WAITING && snapshot.getState() === ServerState.PLAYING) {
			this.state = GameState.PLAYING;
			this.emit("game:playing", { snapshot: undefined });
		}

		this.snapshot = snapshot;
	}

	private emit<K extends keyof CombinedEvents<T>>(event: K, data: CombinedEvents<T>[K]) {
		this.listener?.(event, data); // O listener genérico aceita qualquer um
		this.listeners[event]?.forEach((callback) => callback(data));
	}
}

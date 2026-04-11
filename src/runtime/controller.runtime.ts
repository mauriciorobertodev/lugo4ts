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
import { GameState, type IGameController } from "@/interfaces/controller.interface.js";
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
import type { Event, EventData, GenericEventListener } from "@/runtime/events.runtime.js";
import { logger } from "@/utils/logger.utils.js";
// import { danger, debug, info, success, warn } from '@/utils/logger.js';
import { intToSide, sideToInt } from "@/utils/side.utils.js";

export class GameController implements IGameController {
	private uuid: string = crypto.randomUUID();
	private remote: RemoteClient;
	private broadcast: BroadcastClient;
	private state: GameState = GameState.WAITING;
	private snapshot: GameSnapshot | null = null;

	private listeners: { [K in Event]?: ((data: EventData[K]) => void)[] } = {};
	private listener: GenericEventListener | null = null;

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
		return new Promise<GameSnapshot | null>(async (resolve, reject) => {
			try {
				const call = await this.remote.nextTurn({});
				const lugoSnapshot = call.response.gameSnapshot;
				resolve(lugoSnapshot ? fromLugoGameSnapshot(lugoSnapshot) : null);
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao avançar turno");
				console.error(error);
				reject(error);
			}
		});
	}

	async nextOrder(): Promise<GameSnapshot | null> {
		return new Promise<GameSnapshot | null>(async (resolve, reject) => {
			try {
				const call = await this.remote.nextOrder({});
				const lugoSnapshot = call.response.gameSnapshot;
				resolve(lugoSnapshot ? fromLugoGameSnapshot(lugoSnapshot) : null);
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao avançar ordem");
				console.error(error);
				reject(error);
			}
		});
	}

	async play(): Promise<GameSnapshot | null> {
		return new Promise<GameSnapshot | null>(async (resolve, reject) => {
			try {
				const call = await this.remote.pauseOrResume({});
				const lugoSnapshot = call.response.gameSnapshot;
				resolve(lugoSnapshot ? fromLugoGameSnapshot(lugoSnapshot) : null);
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao iniciar jogo");
				console.error(error);
				reject(error);
			}
		});
	}

	async pause(): Promise<GameSnapshot | null> {
		return await this.play();
	}

	async getGameSnapshot(): Promise<GameSnapshot | null> {
		return new Promise<GameSnapshot | null>(async (resolve, reject) => {
			try {
				const call = await this.remote.getGameSnapshot({});
				const lugoSnapshot = call.response.gameSnapshot;
				resolve(lugoSnapshot ? fromLugoGameSnapshot(lugoSnapshot) : null);
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao obter snapshot do jogo");
				console.error(error);
				reject(error);
			}
		});
	}

	async resetPlayerPositions(): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
			try {
				const res = await this.remote.resetPlayerPositions({});
				const lugoSnapshot = res.response.gameSnapshot;
				logger.debug("[CONTROLLER] ✅ Posições resetadas com sucesso");
				resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao resetar posições dos jogadores");
				console.error(error);
				reject(error);
			}
		});
	}

	async resetBallPosition(): Promise<GameSnapshot> {
		return this.setBallPosition(new Point(SPECS.CENTER_X_COORDINATE, SPECS.CENTER_Y_COORDINATE));
	}

	async addPlayer(player: Player): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
			try {
				const res = await this.remote.setPlayerProperties({
					number: player.getNumber(),
					side: sideToInt(player.getTeamSide()),
					position: toLugoPoint(player.getPosition()),
					velocity: toLugoVelocity(player.getVelocity()),
				});
				const lugoSnapshot = res.response.gameSnapshot;
				return resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error(`[CONTROLLER] ❌ Erro definir jogador "${player.getNumber()}" do lado "${player.getTeamSide()}"`);
				console.error(error);
				reject(error);
			}
		});
	}

	async setPlayerPosition(side: Side, number: number, position: Point): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
			try {
				const res = await this.remote.setPlayerProperties({
					number: number,
					side: sideToInt(side),
					position: toLugoPoint(position),
				});
				const lugoSnapshot = res.response.gameSnapshot;
				return resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao definir posição do jogador");
				console.error(error);
				reject(error);
			}
		});
	}

	async setPlayersPositions(positions: { side: Side; number: number; position: Point }[]): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
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
				resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao definir posições dos jogadores");
				console.error(error);
				reject(error);
			}
		});
	}

	async setPlayerVelocity(side: Side, number: number, velocity: Velocity): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
			try {
				const res = await this.remote.setPlayerProperties({
					number: number,
					side: sideToInt(side),
					velocity: toLugoVelocity(velocity),
				});
				const lugoSnapshot = res.response.gameSnapshot;
				return resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao definir velocidade do jogador");
				console.error(error);
				reject(error);
			}
		});
	}

	async setPlayerSpeed(side: Side, number: number, speed: number): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
			try {
				const res = await this.remote.setPlayerProperties({
					number: number,
					side: sideToInt(side),
					velocity: { speed },
				});
				const lugoSnapshot = res.response.gameSnapshot;
				return resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao definir velocidade do jogador");
				console.error(error);
				reject(error);
			}
		});
	}

	async setBall(ball: Ball): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
			try {
				const res = await this.remote.setBallProperties({
					position: toLugoPoint(ball.getPosition()),
					velocity: toLugoVelocity(ball.getVelocity()),
					holder: ball.getHolder() ? toLugoPlayer(ball.getHolder()!) : undefined,
				});
				const lugoSnapshot = res.response.gameSnapshot;
				return resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao definir propriedades da bola");
				console.error(error);
				reject(error);
			}
		});
	}

	async setBallPosition(position: Point): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
			try {
				const res = await this.remote.setBallProperties({ position: toLugoPoint(position) });
				const lugoSnapshot = res.response.gameSnapshot;
				return resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao definir posição da bola");
				console.error(error);
				reject(error);
			}
		});
	}

	async setBallVelocity(velocity: Velocity): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
			try {
				const res = await this.remote.setBallProperties({ velocity: toLugoVelocity(velocity) });
				const lugoSnapshot = res.response.gameSnapshot;
				return resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao definir velocidade da bola");
				console.error(error);
				reject(error);
			}
		});
	}

	async setBallSpeed(speed: number): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
			try {
				const res = await this.remote.setBallProperties({ velocity: { speed } });
				const lugoSnapshot = res.response.gameSnapshot;
				return resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao definir velocidade da bola");
				console.error(error);
				reject(error);
			}
		});
	}

	async resumeListeningPhase(): Promise<void> {
		try {
			await this.remote.resumeListeningPhase({});
		} catch (error) {
			logger.error("[CONTROLLER] ❌ Erro ao resumir fase de escuta");
			console.error(error);
		}
	}

	async setupEventListeners(): Promise<void> {
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
					this.listener?.("game:paused", { snapshot });
					this.listeners["game:paused"]?.map((callback) => callback({ snapshot }));

					break;
				}
				case "goal": {
					const side = intToSide(event.event.goal.side);
					const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;
					this.listener?.("game:goal", { side, snapshot });
					this.listeners["game:goal"]?.map((callback) => callback({ side, snapshot }));

					break;
				}
				case "debugReleased": {
					this.state = GameState.PLAYING;

					const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;
					this.listener?.("game:playing", { snapshot });
					this.listeners["game:playing"]?.map((callback) => callback({ snapshot }));

					break;
				}
				case "gameOver": {
					this.state = GameState.OVER;

					const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;
					const reason = fromLugoGameOverReason(event.event.gameOver.reason);
					this.listener?.("game:over", { snapshot, reason });
					this.listeners["game:over"]?.map((callback) => callback({ snapshot, reason }));

					break;
				}
				case "newPlayer":
					if (event.event.newPlayer.player) {
						const player = fromLugoPlayer(event.event.newPlayer.player);
						const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;
						this.listener?.("game:joined", { player, snapshot });
						this.listeners["game:joined"]?.map((callback) => callback({ player, snapshot }));
					}

					break;
				case "lostPlayer":
					if (event.event.lostPlayer.player) {
						const player = fromLugoPlayer(event.event.lostPlayer.player);
						const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;
						this.listener?.("game:leaved", { player, snapshot });
						this.listeners["game:leaved"]?.map((callback) => callback({ player, snapshot }));
					}

					break;
				case "stateChange": {
					const prevState = fromLugoGameState(event.event.stateChange.previousState);
					const newState = fromLugoGameState(event.event.stateChange.newState);
					const snapshot = event.gameSnapshot ? fromLugoGameSnapshot(event.gameSnapshot) : undefined;
					this.listener?.("game:changed", { prevState, newState, snapshot });
					this.listeners["game:changed"]?.map((callback) => callback({ prevState, newState, snapshot }));

					break;
				}
				default:
					logger.warn(`[EVENT] Evento desconhecido: ${event.event?.oneofKind}`);
			}
		});

		responses.onError((err) => {
			logger.error("[EVENT] Erro no stream de eventos:");
			console.error(err);
			this.listener?.("stream:error", { error: err.message });
			this.listeners["stream:error"]?.map((callback) => callback({ error: err.message }));
		});

		responses.onComplete(() => {
			logger.warn("[EVENT] ⚠️ Stream finalizada.");
			this.listener?.("stream:ended", null);
			this.listeners["stream:ended"]?.map((callback) => callback(null));
			// Optionally, you can attempt to restart the stream here
			// this.setupEventListeners();
		});

		logger.debug("[EVENT] ✅ Stream iniciado");
		this.listener?.("stream:started", null);
		this.listeners["stream:started"]?.map((callback) => callback(null));
	}

	async startGame(): Promise<GameSetup> {
		return new Promise<GameSetup>(async (resolve, reject) => {
			try {
				const call = await this.broadcast.startGame({ watcherUuid: this.uuid });
				logger.debug("[CONTROLLER] ✅ Jogo iniciado");
				resolve(call.response);
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao iniciar jogo");
				console.error(error);
				reject(error);
			}
		});
	}

	async getGameSetup(): Promise<GameSetup> {
		return new Promise<GameSetup>(async (resolve, reject) => {
			try {
				const call = await this.broadcast.getGameSetup({ uuid: this.uuid });
				logger.debug("[GAME SETUP] ✅ Recebido");
				resolve(call.response);
			} catch (error) {
				logger.error("[GAME SETUP] ❌ Erro ao obter configuração do jogo");
				console.error(error);
				reject(error);
			}
		});
	}

	public onEvent(listener: GenericEventListener) {
		this.listener = listener;
	}

	public on<K extends Event>(event: K, callback: (data: EventData[K]) => void) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event]?.push(callback);
	}

	public applyEnvironment(environment: Environment): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
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

				resolve(snapshot!);
			} catch (error) {
				logger.error("[CONTROLLER] ❌ Erro ao aplicar ambiente");
				console.error(error);
				reject(error);
			}
		});
	}

	public setTurn(turn: number): Promise<GameSnapshot> {
		return new Promise<GameSnapshot>(async (resolve, reject) => {
			try {
				const properties = GameProperties.create();
				const res = await this.remote.setGameProperties({ ...properties, turn });
				const lugoSnapshot = res.response.gameSnapshot;
				return resolve(fromLugoGameSnapshot(lugoSnapshot!));
			} catch (error) {
				logger.error(`[CONTROLLER] Erro ao definir turno como ${turn}:`);
				console.error(error);
				reject(error);
			}
		});
	}
}

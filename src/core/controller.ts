import {
    Ball,
    Environment,
    Event,
    EventData,
    GameSnapshot,
    GenericEventListener,
    Player,
    Point,
    SPECS,
    Side,
    Velocity,
} from '@/core.js';
import { IFormation, IGameController } from '@/interfaces.js';
import { intToSide, sideToInt } from '@/utils.js';
import { credentials } from '@grpc/grpc-js';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';

import { BroadcastClient } from '@/generated/broadcast.client.js';
import { GameEvent, GameSetup } from '@/generated/broadcast.js';
import { RemoteClient } from '@/generated/remote.client.js';
import { GameProperties } from '@/generated/remote.js';
import { GameSnapshot_State } from '@/generated/server.js';

import {
    fromLugoGameSnapshot,
    fromLugoPlayer,
    toLugoPlayer,
    toLugoPoint,
    toLugoShotClock,
    toLugoVelocity,
} from '@/lugo.js';

export class GameController implements IGameController {
    private uuid: string = crypto.randomUUID();
    private remote: RemoteClient;
    private broadcast: BroadcastClient;

    private listeners: { [K in Event]?: ((data: EventData[K]) => void)[] } = {};
    private listener: GenericEventListener | null = null;

    constructor(serverAddress: string) {
        const transport = new GrpcTransport({
            host: serverAddress,
            channelCredentials: credentials.createInsecure(),
            clientOptions: {
                'grpc.primary_user_agent': `controller/${this.uuid}`,
            },
        });

        this.remote = new RemoteClient(transport);
        this.broadcast = new BroadcastClient(transport);
    }

    async setTeamFormation(side: Side, formation: IFormation): Promise<void> {
        Object.entries(formation.toArray()).forEach(([number, position]) => {
            this.remote.setPlayerProperties({
                number: parseInt(number, 10),
                side: sideToInt(side),
                position: toLugoPoint(position),
            });
        });
    }

    async setHomeTeamFormation(formation: IFormation): Promise<void> {
        return this.setTeamFormation(Side.HOME, formation);
    }

    async setAwayTeamFormation(formation: IFormation): Promise<void> {
        return this.setTeamFormation(Side.AWAY, formation);
    }

    async nextTurn(): Promise<void> {
        try {
            await this.remote.nextTurn({});
            console.log('[CONTROLLER] Turn avançado com sucesso');
        } catch (error) {
            console.error('[CONTROLLER] Erro ao avançar turno:', error);
        }
    }

    async nextOrder(): Promise<void> {
        try {
            await this.remote.nextOrder({});
        } catch (error) {
            console.error('[CONTROLLER] Erro ao avançar ordem:', error);
        }
    }

    async play(): Promise<void> {
        try {
            await this.remote.pauseOrResume({});
        } catch (error) {
            console.error('[CONTROLLER] Erro ao iniciar jogo:', error);
        }
    }

    async pause(): Promise<void> {
        return this.play();
    }

    async getGameSnapshot(): Promise<GameSnapshot | null> {
        return new Promise<GameSnapshot | null>(async (resolve, reject) => {
            try {
                const call = await this.remote.getGameSnapshot({});
                const lugoSnapshot = call.response.gameSnapshot;
                resolve(lugoSnapshot ? fromLugoGameSnapshot(lugoSnapshot) : null);
            } catch (error) {
                console.error('[CONTROLLER] Erro ao obter snapshot do jogo:', error);
                reject(error);
            }
        });
    }

    async resetPlayerPositions(): Promise<GameSnapshot> {
        return new Promise<GameSnapshot>(async (resolve, reject) => {
            try {
                const res = await this.remote.resetPlayerPositions({});
                const lugoSnapshot = res.response.gameSnapshot;
                console.log('[CONTROLLER] ✅ Jogadores resetados com sucesso');
                resolve(fromLugoGameSnapshot(lugoSnapshot!));
            } catch (error) {
                console.error('[CONTROLLER] Erro ao resetar posições dos jogadores:', error);
                reject(error);
            }
        });
    }

    async resetBallPosition(): Promise<GameSnapshot> {
        return this.setBallPosition(new Point(SPECS.FIELD_CENTER_X, SPECS.FIELD_CENTER_Y));
    }

    async setPlayer(player: Player): Promise<GameSnapshot> {
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
                console.error('[CONTROLLER] Erro ao resetar posições dos jogadores:', error);
                reject(error);
            }
        });
    }

    async setPlayerPosition(player: Player, position: Point): Promise<GameSnapshot> {
        return new Promise<GameSnapshot>(async (resolve, reject) => {
            try {
                await this.remote.setPlayerProperties({
                    number: player.getNumber(),
                    side: sideToInt(player.getTeamSide()),
                    position: toLugoPoint(position),
                });
            } catch (error) {
                console.error('[CONTROLLER] Erro ao definir posição do jogador:', error);
                reject(error);
            }
        });
    }

    async setPlayerVelocity(player: Player, velocity: Velocity): Promise<GameSnapshot> {
        return new Promise<GameSnapshot>(async (resolve, reject) => {
            try {
                const res = await this.remote.setPlayerProperties({
                    number: player.getNumber(),
                    side: sideToInt(player.getTeamSide()),
                    velocity: velocity.toLugoVelocity(),
                });
                const lugoSnapshot = res.response.gameSnapshot;
                return resolve(fromLugoGameSnapshot(lugoSnapshot!));
            } catch (error) {
                console.error('[CONTROLLER] Erro ao definir velocidade do jogador:', error);
                reject(error);
            }
        });
    }

    async setPlayerSpeed(player: Player, speed: number): Promise<GameSnapshot> {
        return new Promise<GameSnapshot>(async (resolve, reject) => {
            try {
                const res = await this.remote.setPlayerProperties({
                    number: player.getNumber(),
                    side: sideToInt(player.getTeamSide()),
                    velocity: { speed },
                });
                const lugoSnapshot = res.response.gameSnapshot;
                return resolve(fromLugoGameSnapshot(lugoSnapshot!));
            } catch (error) {
                console.error('[CONTROLLER] Erro ao definir velocidade do jogador:', error);
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
                console.error('[CONTROLLER] Erro ao definir propriedades da bola:', error);
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
                console.error('[CONTROLLER] Erro ao definir posição da bola:', error);
                reject(error);
            }
        });
    }

    async setBallVelocity(velocity: Velocity): Promise<GameSnapshot> {
        return new Promise<GameSnapshot>(async (resolve, reject) => {
            try {
                const res = await this.remote.setBallProperties({ velocity: velocity.toLugoVelocity() });
                const lugoSnapshot = res.response.gameSnapshot;
                return resolve(fromLugoGameSnapshot(lugoSnapshot!));
            } catch (error) {
                console.error('[CONTROLLER] Erro ao definir velocidade da bola:', error);
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
                console.error('[CONTROLLER] Erro ao definir velocidade da bola:', error);
                reject(error);
            }
        });
    }

    async resumeListeningPhase(): Promise<void> {
        try {
            await this.remote.resumeListeningPhase({});
            // console.log('[CONTROLLER] ✅ Fase de resumida');
        } catch (error) {
            console.error('[CONTROLLER] ❌ Erro ao resumir fase:', error);
        }
    }

    async setupEventListeners(): Promise<void> {
        const { responses } = this.broadcast.onEvent({ uuid: this.uuid });

        responses.onNext((event) => {
            // console.log('[EVENT]', event?.gameSnapshot?.turn, event?.event?.oneofKind);
        });

        responses.onMessage((event: GameEvent) => {
            switch (event.event?.oneofKind) {
                case 'breakpoint':
                    this.listener?.('pause', {});
                    this.listeners['pause']?.forEach((callback) => callback({}));
                    break;
                case 'goal':
                    const side = intToSide(event.event.goal.side);
                    this.listener?.('goal', { side });
                    this.listeners['goal']?.forEach((callback) => callback({ side }));

                    break;
                case 'debugReleased':
                    this.listener?.('play', {});
                    this.listeners['play']?.forEach((callback) => callback({}));
                    break;
                case 'gameOver':
                    this.listener?.('over', {});
                    this.listeners['over']?.forEach((callback) => callback({}));
                    break;
                case 'newPlayer':
                    if (event.event.newPlayer.player) {
                        const player = fromLugoPlayer(event.event.newPlayer.player);
                        this.listener?.('player-join', { player });
                        this.listeners['player-join']?.forEach((callback) => callback({ player }));
                    }
                    break;
                case 'lostPlayer':
                    if (event.event.lostPlayer.player) {
                        this.listener?.('player-leave', {
                            player: fromLugoPlayer(event.event.lostPlayer.player),
                        });
                    }
                    break;
                case 'stateChange':
                    if (event.event.stateChange.newState === GameSnapshot_State.PLAYING) {
                        if (!event.gameSnapshot) {
                            this.listener?.('turn', {});
                            return;
                        } else {
                            this.listener?.('turn', {
                                snapshot: fromLugoGameSnapshot(event.gameSnapshot),
                            });
                        }
                    }
                    break;
                default:
                    console.warn('[EVENT] Evento desconhecido:', event.event?.oneofKind);
            }
        });

        responses.onError((err) => {
            console.error('[EVENT] Erro no stream:', err);
        });

        responses.onComplete(() => {
            console.warn('[EVENT] ⚠️ Stream finalizada.');
        });

        console.log('[EVENT] ✅ Stream iniciado');
    }

    async startGame(): Promise<GameSetup> {
        return new Promise<GameSetup>(async (resolve, reject) => {
            try {
                const call = await this.broadcast.startGame({ watcherUuid: this.uuid });
                console.log('[CONTROLLER] ✅ Jogo iniciado');
                resolve(call.response);
            } catch (error) {
                console.error('[CONTROLLER] ❌ Erro ao iniciar jogo:', error);
                reject(error);
            }
        });
    }

    async getGameSetup(): Promise<GameSetup> {
        return new Promise<GameSetup>(async (resolve, reject) => {
            try {
                const call = await this.broadcast.getGameSetup({ uuid: this.uuid });
                console.log('[GAME SETUP] ✅ Recebido');
                resolve(call.response);
            } catch (error) {
                console.error('[GAME SETUP] ❌ Erro ao obter:', error);
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
        this.listeners[event]!.push(callback);
    }

    public applyEnvironment(environment: Environment): Promise<GameSnapshot> {
        return new Promise<GameSnapshot>(async (resolve, reject) => {
            try {
                console.log('[CONTROLLER] Aplicando ambiente:', environment.getName());

                const ball = environment.getBall();
                const homeTeam = environment.getHomePlayers();
                const awayTeam = environment.getAwayPlayers();
                const homeScore = environment.getHomeTeam()?.getScore();
                const awayScore = environment.getAwayTeam()?.getScore();
                const turn = environment.getTurn();

                if (ball) {
                    console.log('[CONTROLLER] Definindo bola...');
                    await this.setBall(ball);
                }

                if (homeTeam) {
                    console.log('[CONTROLLER] Definindo jogadores do time da HOME...');
                    for (const player of homeTeam) {
                        console.log(`[CONTROLLER] Definindo jogador HOME ${player.getNumber()}...`);
                        await this.setPlayer(player);
                        console.log(`[CONTROLLER] Jogador HOME ${player.getNumber()} definido.`);
                    }
                }

                if (awayTeam) {
                    console.log('[CONTROLLER] Definindo jogadores do time da AWAY...');
                    for (const player of awayTeam) {
                        console.log(`[CONTROLLER] Definindo jogador AWAY ${player.getNumber()}...`);
                        await this.setPlayer(player);
                        console.log(`[CONTROLLER] Jogador AWAY ${player.getNumber()} definido.`);
                    }
                }

                console.log('[CONTROLLER] Definindo propriedades do jogo...');
                await this.remote.setGameProperties({
                    turn: turn ?? 0,
                    homeScore: homeScore ?? 0,
                    awayScore: awayScore ?? 0,
                    frameInterval: BigInt(0),
                    shotClock: environment.getShotClock() ? toLugoShotClock(environment.getShotClock()!) : undefined,
                });

                const snapshot = await this.getGameSnapshot();

                console.log('[CONTROLLER] ✅ Ambiente aplicado com sucesso');

                resolve(snapshot!);
            } catch (error) {
                console.error('[CONTROLLER] ❌ Erro ao aplicar ambiente:', error);
                reject(error);
            }
        });
    }

    setTurn(turn: number): Promise<GameSnapshot> {
        return new Promise<GameSnapshot>(async (resolve, reject) => {
            try {
                const properties = GameProperties.create();
                const res = await this.remote.setGameProperties({ ...properties, turn });
                const lugoSnapshot = res.response.gameSnapshot;
                return resolve(fromLugoGameSnapshot(lugoSnapshot!));
            } catch (error) {
                console.error('[CONTROLLER] Erro ao definir turno:', error);
                reject(error);
            }
        });
    }
}

import { credentials } from '@grpc/grpc-js';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';

import { BroadcastClient } from '../generated/broadcast.client.js';
import { GameEvent, GameSetup } from '../generated/broadcast.js';
import { RemoteClient } from '../generated/remote.client.js';
import { GameSnapshot_State } from '../generated/server.js';

import type { IGameController } from '../interfaces/controller.js';
import { ISnapshot } from '../interfaces/snapshot.js';

import { PlayerFactory } from '../factories/player.factory.js';
import { SnapshotFactory } from '../factories/snapshot.factory.js';

import { Ball } from './ball.js';
import { Event, EventData, GenericEventListener } from './events.js';
import { Formation } from './formation.js';
import { Player } from './player.js';
import { Point } from './point.js';
import { Side, SideFactory } from './side.js';
import { SPECS } from './specs.js';
import { Velocity } from './velocity.js';

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
            clientOptions: {},
        });

        this.remote = new RemoteClient(transport);
        this.broadcast = new BroadcastClient(transport);
    }

    async setTeamFormation(side: Side, formation: Formation): Promise<void> {
        Object.entries(formation.toArray()).forEach(([number, position]) => {
            this.remote.setPlayerProperties({
                number: parseInt(number, 10),
                side: SideFactory.toInt(side),
                position: position.toLugoPoint(),
            });
        });
    }

    async setHomeTeamFormation(formation: Formation): Promise<void> {
        return this.setTeamFormation(Side.HOME, formation);
    }

    async setAwayTeamFormation(formation: Formation): Promise<void> {
        return this.setTeamFormation(Side.AWAY, formation);
    }

    async goToNextTurn(): Promise<void> {
        try {
            await this.remote.nextTurn({});
        } catch (error) {
            console.error('[CONTROLLER] Erro ao avançar turno:', error);
        }
    }

    async goToNextOrder(): Promise<void> {
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

    async getGameSnapshot(): Promise<ISnapshot | null> {
        try {
            const call = await this.remote.getGameSnapshot({});
            return call.response.gameSnapshot ? SnapshotFactory.fromLugoSnapshot(call.response.gameSnapshot) : null;
        } catch (error) {
            console.error('[CONTROLLER] Erro ao obter snapshot do jogo:', error);
            return null;
        }
    }

    async resetPlayerPositions(): Promise<void> {
        try {
            await this.remote.resetPlayerPositions({});
        } catch (error) {
            console.error('[CONTROLLER] Erro ao resetar posições dos jogadores:', error);
        }
    }

    async resetBallPosition(): Promise<void> {
        this.setBallPosition(new Point(SPECS.FIELD_CENTER_X, SPECS.FIELD_CENTER_Y));
    }

    async setPlayer(player: Player): Promise<void> {
        try {
            await this.remote.setPlayerProperties({
                number: player.getNumber(),
                side: SideFactory.toInt(player.getTeamSide()),
                position: player.getPosition().toLugoPoint(),
                velocity: player.getVelocity().toLugoVelocity(),
            });
        } catch (error) {
            console.error('[CONTROLLER] Erro ao resetar posições dos jogadores:', error);
        }
    }

    async setPlayerPosition(player: Player, position: Point): Promise<void> {
        try {
            await this.remote.setPlayerProperties({
                number: player.getNumber(),
                side: SideFactory.toInt(player.getTeamSide()),
                position: position.toLugoPoint(),
            });
        } catch (error) {
            console.error('[CONTROLLER] Erro ao definir posição do jogador:', error);
        }
    }

    async setPlayerVelocity(player: Player, velocity: Velocity): Promise<void> {
        try {
            await this.remote.setPlayerProperties({
                number: player.getNumber(),
                side: SideFactory.toInt(player.getTeamSide()),
                velocity: velocity.toLugoVelocity(),
            });
        } catch (error) {
            console.error('[CONTROLLER] Erro ao definir velocidade do jogador:', error);
        }
    }

    async setPlayerSpeed(player: Player, speed: number): Promise<void> {
        try {
            await this.remote.setPlayerProperties({
                number: player.getNumber(),
                side: SideFactory.toInt(player.getTeamSide()),
                velocity: { speed },
            });
        } catch (error) {
            console.error('[CONTROLLER] Erro ao definir velocidade do jogador:', error);
        }
    }

    async setBall(ball: Ball): Promise<void> {
        try {
            await this.remote.setBallProperties({
                position: ball.getPosition().toLugoPoint(),
                velocity: ball.getVelocity().toLugoVelocity(),
            });
        } catch (error) {
            console.error('[CONTROLLER] Erro ao definir propriedades da bola:', error);
        }
    }

    async setBallPosition(position: Point): Promise<void> {
        try {
            await this.remote.setBallProperties({ position: position.toLugoPoint() });
        } catch (error) {
            console.error('[CONTROLLER] Erro ao definir posição da bola:', error);
        }
    }

    async setBallVelocity(velocity: Velocity): Promise<void> {
        try {
            await this.remote.setBallProperties({ velocity: velocity.toLugoVelocity() });
        } catch (error) {
            console.error('[CONTROLLER] Erro ao definir velocidade da bola:', error);
        }
    }

    async setBallSpeed(speed: number): Promise<void> {
        try {
            await this.remote.setBallProperties({ velocity: { speed } });
        } catch (error) {
            console.error('[CONTROLLER] Erro ao definir velocidade da bola:', error);
        }
    }

    async setupEventListeners(): Promise<void> {
        await this.getGameSetup();

        const { responses } = this.broadcast.onEvent({ uuid: this.uuid });

        responses.onNext((event) => {
            console.log('[EVENT]', event?.gameSnapshot?.turn, event?.event?.oneofKind);
        });

        responses.onMessage((event: GameEvent) => {
            console.log('[EVENT]', event?.gameSnapshot?.turn, event?.event?.oneofKind);

            switch (event.event?.oneofKind) {
                case 'breakpoint':
                    this.listener?.('pause', {});
                    break;
                case 'goal':
                    this.listener?.('goal', { side: SideFactory.fromInt(event.event.goal.side) });
                    break;
                case 'debugReleased':
                    this.listener?.('play', { debugReleased: event.event.debugReleased });
                    break;
                case 'gameOver':
                    this.listener?.('over', {});
                    break;
                case 'newPlayer':
                    if (event.event.newPlayer.player) {
                        this.listener?.('player-join', {
                            player: PlayerFactory.fromLugoPlayer(event.event.newPlayer.player),
                        });
                    }
                    break;
                case 'lostPlayer':
                    if (event.event.lostPlayer.player) {
                        this.listener?.('player-leave', {
                            player: PlayerFactory.fromLugoPlayer(event.event.lostPlayer.player),
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
                                snapshot: SnapshotFactory.fromLugoSnapshot(event.gameSnapshot),
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

    async startGame(): Promise<GameSetup | null> {
        try {
            const call = await this.broadcast.startGame({ watcherUuid: this.uuid });
            console.log('[GAME START] ✅ Iniciado');
            return call.response;
        } catch (error) {
            console.error('[GAME START] ❌ Erro ao iniciar:', error);
            return null;
        }
    }

    async getGameSetup(): Promise<GameSetup> {
        try {
            const call = await this.broadcast.getGameSetup({ uuid: this.uuid });
            console.log('[GAME SETUP] ✅ Recebido');
            return call.response;
        } catch (error) {
            console.error('[GAME SETUP] ❌ Erro ao obter:', error);
            throw error;
        }
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
}

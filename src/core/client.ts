import { credentials } from '@grpc/grpc-js';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';

import { GameClient } from '../generated/server.client.js';
import { GameSnapshot, GameSnapshot_State, JoinRequest, Order, OrderSet } from '../generated/server.js';

import type { IBot } from '../interfaces/bot.js';
import type { IClient } from '../interfaces/client.ts';

import { GameInspector } from './inspector.js';
import { PlayerState } from './player.js';
import { Point } from './point.js';
import { Side, SideFactory } from './side.js';

export class Client implements IClient {
    private client?: GameClient;

    constructor(
        private serverAdd: string,
        private token: string,
        private side: Side,
        private number: number,
        private initPosition: Point
    ) {}

    async playAsBot(bot: IBot): Promise<void> {
        const transport = new GrpcTransport({
            host: this.serverAdd,
            channelCredentials: credentials.createInsecure(),
            clientOptions: {},
        });

        this.client = new GameClient(transport);

        const running = this.client.joinATeam({
            token: this.token,
            protocolVersion: '1.0.0',
            teamSide: SideFactory.toInt(this.side),
            number: this.number,
            initPosition: this.initPosition.toLugoPoint(),
        } satisfies JoinRequest);

        for await (const snapshot of running.responses as AsyncIterable<GameSnapshot>) {
            /**
             * O jogo redefine a posição dos jogadores para iniciar a partida ou para reiniciá-la após um gol.
             */
            if (snapshot.state === GameSnapshot_State.GET_READY) {
                const inspector = new GameInspector(this.side, this.number, snapshot);
                bot.onReady(inspector);
            }

            /**
             * O jogo está esperando por ordens dos jogadores.
             * Há uma janela de tempo configurável para esta fase. Após o tempo limite expirar,
             * o servidor ignorará as ordens faltantes e processará as que recebeu.
             */
            if (snapshot.state === GameSnapshot_State.LISTENING) {
                console.log('Game is listening for actions...');
                this.client.sendOrders({
                    turn: snapshot.turn as number,
                    orders: [] as Order[],
                    debugMessage: 'Game is listening for actions...',
                } satisfies OrderSet);

                const inspector = new GameInspector(this.side, this.number, snapshot);
                this.onListening(inspector, bot);
            }

            /**
             * O jogo pode terminar após qualquer fase.
             */
            if (snapshot.state === GameSnapshot_State.OVER) {
                console.log('Game is over!');
            }

            /**
             * O jogo executa as ordens dos jogadores na mesma sequência em que foram recebidas.
             */
            if (snapshot.state === GameSnapshot_State.PLAYING) {
                console.log('Game is now playing!');
            }

            /**
             * O jogo interrompe a partida para mudar a posse de bola.
             * Isso acontece somente quando o tempo do chute acaba (veja a propriedade shot_clock). A bola será dada ao goleiro do time de defesa,
             * e o próximo estado será "ouvindo", então os bots não terão tempo de se reorganizar antes do próximo turno.
             */
            if (snapshot.state === GameSnapshot_State.SHIFTING) {
                console.log('Game is shifting...');
            }

            /**
             * O jogo está esperando que todos os jogadores estejam conectados.
             * Há um limite de tempo configurável para esperar os jogadores. Após esse limite expirar, a partida é considerada encerrada.
             */
            if (snapshot.state === GameSnapshot_State.WAITING) {
                console.log('Game is waiting for players...');
            }
        }
    }

    private getOrderSet(inspector: GameInspector, bot: IBot): OrderSet {
        bot.beforeActions(inspector);

        const playerState = inspector.getMyState();
        const me = inspector.getMe();

        let orders: (Order | null | undefined)[];

        if (me.isGoalkeeper()) {
            orders = bot.asGoalkeeper(inspector, playerState);
        } else {
            switch (playerState) {
                case PlayerState.DEFENDING:
                    orders = bot.onDefending(inspector);
                    break;
                case PlayerState.HOLDING:
                    orders = bot.onHolding(inspector);
                    break;
                case PlayerState.DISPUTING:
                    orders = bot.onDisputing(inspector);
                    break;
                case PlayerState.SUPPORTING:
                    orders = bot.onSupporting(inspector);
                    break;
                default:
                    orders = [];
            }
        }

        const orderSet = OrderSet.create({
            orders: orders.filter((order) => order !== null && order !== undefined),
            debugMessage: 'Orders generated by bot',
            turn: inspector.getTurn(),
        });

        bot.afterActions(inspector);

        return orderSet;
    }

    private async onListening(inspector: GameInspector, bot: IBot): Promise<void> {
        const orderSet = this.getOrderSet(inspector, bot);

        const call = this.client?.sendOrders(orderSet);

        call
            ?.then(() => {
                console.log('Orders sent successfully');
            })
            .catch((error) => {
                console.error('Error in sendOrders call:', error);
            });
    }
}

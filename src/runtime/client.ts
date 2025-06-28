import { credentials } from '@grpc/grpc-js';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';

import { GameClient } from '@/generated/server.client.js';
import { GameSnapshot, GameSnapshot_State, Order, OrderSet } from '@/generated/server.js';

import { IBot } from '@/interfaces/bot.js';
import { IClient } from '@/interfaces/client.js';
import { IGameInspector } from '@/interfaces/game-inspector.js';
import { IPoint } from '@/interfaces/positionable.js';

import { PlayerState } from '@/core/player.js';
import { Side } from '@/core/side.js';

import { fromGameSnapshot } from '@/utils/game-inspector.js';
import { setLogPlayer } from '@/utils/logger.js';
import { sideToInt } from '@/utils/side.js';

import { fromLugoGameSnapshot, toLugoPoint } from '@/lugo.js';

type KnownErrorCode =
    | 'ALREADY_EXISTS' // Mesma conexão grpc tentando se conectar novamente
    | 'UNAVAILABLE'; // Servidor indisponível

export class Client implements IClient {
    private isConnected = false;
    private client?: GameClient;

    constructor(
        private serverAdd: string,
        private token: string,
        private side: Side,
        private number: number,
        private initPosition: IPoint
    ) {}

    async playAsBot(bot: IBot, onJoin?: () => void): Promise<void> {
        /**
         * O transport é uma instância do GrpcTransport que permite a comunicação com o servidor gRPC.
         * Ele é configurado com o endereço do servidor, as credenciais do canal e as opções do cliente.
         */
        const transport = new GrpcTransport({
            host: this.serverAdd,
            channelCredentials: credentials.createInsecure(),
            clientOptions: {
                'grpc.primary_user_agent': `Bot -  ${this.side} - ${this.number}`,
            },
        });

        /**
         * O client é uma instância do GameClient que permite interagir com o servidor gRPC.
         * Ele é usado para enviar e receber mensagens do servidor, como se juntar a um time,
         * enviar ordens e receber snapshots do jogo.
         */
        this.client = new GameClient(transport);

        console.log(
            `[GRPC] Conectando no jogo do lado ${this.side} com o número ${this.number} e posição inicial ${this.initPosition.toString()}...`
        );

        const stream = this.client.joinATeam({
            token: this.token,
            protocolVersion: '1.0.0',
            teamSide: sideToInt(this.side),
            number: this.number,
            initPosition: toLugoPoint(this.initPosition),
        });

        const startTimeout = setTimeout(() => this.playing(onJoin), 100);

        stream.responses.onError((error: Error & { code?: string }) => {
            console.error(
                `[GRPC] Erro na conexão com servidor do jogo, no lado ${this.side} e número ${this.number} com posição inicial ${this.initPosition.toString()}`
            );

            clearTimeout(startTimeout);
        });

        stream.responses.onComplete(() => {
            console.log(`[GRPC] Conexão com o jogo do lado ${this.side} e número ${this.number} concluída.`);
        });

        for await (const snapshot of stream.responses as AsyncIterable<GameSnapshot>) {
            /**
             * O jogo redefine a posição dos jogadores para iniciar a partida ou para reiniciá-la após um gol.
             */
            if (snapshot.state === GameSnapshot_State.GET_READY) {
                const inspector = fromGameSnapshot(this.side, this.number, fromLugoGameSnapshot(snapshot));
                bot.onReady(inspector);
            }
            /**
             * O jogo está esperando por ordens dos jogadores.
             * Há uma janela de tempo configurável para esta fase. Após o tempo limite expirar,
             * o servidor ignorará as ordens faltantes e processará as que recebeu.
             */
            if (snapshot.state === GameSnapshot_State.LISTENING) {
                // console.log('Game is listening for actions...');
                const inspector = fromGameSnapshot(this.side, this.number, fromLugoGameSnapshot(snapshot));
                await this.onListening(inspector, bot);
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

    async play(callback: (inspector: IGameInspector) => Promise<Order[]>, onJoin?: () => void): Promise<void> {
        /**
         * O transport é uma instância do GrpcTransport que permite a comunicação com o servidor gRPC.
         * Ele é configurado com o endereço do servidor, as credenciais do canal e as opções do cliente.
         */
        const transport = new GrpcTransport({
            host: this.serverAdd,
            channelCredentials: credentials.createInsecure(),
            clientOptions: {
                'grpc.primary_user_agent': `Bot -  ${this.side} - ${this.number}`,
            },
        });

        /**
         * O client é uma instância do GameClient que permite interagir com o servidor gRPC.
         * Ele é usado para enviar e receber mensagens do servidor, como se juntar a um time,
         * enviar ordens e receber snapshots do jogo.
         */
        this.client = new GameClient(transport);

        console.log(
            `[GRPC] Conectando no jogo do lado ${this.side} com o número ${this.number} e posição inicial ${this.initPosition.toString()}...`
        );

        const stream = this.client.joinATeam({
            token: this.token,
            protocolVersion: '1.0.0',
            teamSide: sideToInt(this.side),
            number: this.number,
            initPosition: toLugoPoint(this.initPosition),
        });

        setTimeout(() => this.playing(onJoin), 100);

        stream.responses.onError((error: Error & { code?: string }) => {
            console.error(
                `[GRPC] Erro na conexão com servidor do jogo, no lado ${this.side} e número ${this.number}: ${error.message}`
            );
        });

        stream.responses.onComplete(() => {
            console.log(`[GRPC] Conexão com o jogo do lado ${this.side} e número ${this.number} concluída.`);
        });

        for await (const snapshot of stream.responses as AsyncIterable<GameSnapshot>) {
            /**
             * O jogo redefine a posição dos jogadores para iniciar a partida ou para reiniciá-la após um gol.
             */
            if (snapshot.state === GameSnapshot_State.GET_READY) {
                const inspector = fromGameSnapshot(this.side, this.number, fromLugoGameSnapshot(snapshot));
                await callback(inspector);
            }
            /**
             * O jogo está esperando por ordens dos jogadores.
             * Há uma janela de tempo configurável para esta fase. Após o tempo limite expirar,
             * o servidor ignorará as ordens faltantes e processará as que recebeu.
             */
            if (snapshot.state === GameSnapshot_State.LISTENING) {
                // console.log('Game is listening for actions...');
                const inspector = fromGameSnapshot(this.side, this.number, fromLugoGameSnapshot(snapshot));
                const orders = await callback(inspector);
                const orderSet = OrderSet.create({
                    orders: orders.filter((order) => order !== null && order !== undefined),
                    debugMessage: 'Orders generated by RL',
                    turn: inspector.getTurn(),
                });
                await this.client?.sendOrders(orderSet);
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

    async sendOrders(orders: OrderSet): Promise<void> {
        await this.client?.sendOrders(orders);
    }

    private async onListening(inspector: IGameInspector, bot: IBot): Promise<void> {
        try {
            const orders = generateOrdersForBot(bot, inspector);

            const orderSet = OrderSet.create({
                orders: orders,
                debugMessage: 'Orders generated by bot',
                turn: inspector.getTurn(),
            });

            await this.client?.sendOrders(orderSet);
        } catch (error) {
            console.error('Error sending orders:', error);
        }
    }

    private playing(onJoin?: () => void): void {
        this.isConnected = true;
        console.log(
            `[GRPC] Conectado ao jogo do lado ${this.side} com o número ${this.number}. Aguardando inicio do jogo...`
        );

        onJoin?.();
    }

    getSide(): Side {
        return this.side;
    }

    getNumber(): number {
        return this.number;
    }
}

export function generateOrdersForBot(bot: IBot, inspector: IGameInspector): Order[] {
    bot.beforeActions(inspector);

    const playerState = inspector.getMyState();
    const me = inspector.getMe();

    setLogPlayer({ playerState });

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

    bot.afterActions(inspector);

    return orders.filter((order) => order !== null && order !== undefined);
}

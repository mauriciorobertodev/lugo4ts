import { credentials } from '@grpc/grpc-js';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';

import { Point } from '../generated/physics.js';
import { GameClient } from '../generated/server.client.js';
import { GameSnapshot, GameSnapshot_State, JoinRequest, Order, OrderSet, Team_Side } from '../generated/server.js';

import type { IClient } from '../interfaces/client.ts';

export class Client implements IClient {
    async playAsBot(): Promise<void> {
        const transport = new GrpcTransport({
            host: 'game_server:6000',
            channelCredentials: credentials.createInsecure(),
            clientOptions: {},
        });

        const client = new GameClient(transport);

        const running = client.joinATeam({
            token: 'your_token_here',
            protocolVersion: '1.0.0',
            teamSide: Team_Side.HOME,
            number: parseInt(process.env.BOT_NUMBER || '1', 10),
            initPosition: { x: 2500, y: 2500 } satisfies Point,
        } satisfies JoinRequest);

        for await (const snapshot of running.responses as AsyncIterable<GameSnapshot>) {
            // console.log('GameSnapshot:', snapshot);
            if (snapshot.state === GameSnapshot_State.GET_READY) {
                console.log('Game is getting ready...');
                client.sendOrders({
                    turn: snapshot.turn as number,
                    orders: [] as Order[],
                    debugMessage: 'Game is getting ready...',
                } satisfies OrderSet);
            }

            if (snapshot.state === GameSnapshot_State.LISTENING) {
                console.log('Game is listening for actions...');
                client.sendOrders({
                    turn: snapshot.turn as number,
                    orders: [] as Order[],
                    debugMessage: 'Game is listening for actions...',
                } satisfies OrderSet);
            }

            if (snapshot.state === GameSnapshot_State.OVER) {
                console.log('Game is over!');
            }

            if (snapshot.state === GameSnapshot_State.PLAYING) {
                console.log('Game is now playing!');
            }

            if (snapshot.state === GameSnapshot_State.SHIFTING) {
                console.log('Game is shifting...');
            }

            if (snapshot.state === GameSnapshot_State.WAITING) {
                console.log('Game is waiting for players...');
            }
        }
    }
}

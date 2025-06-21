import { Order } from '@/generated/server.js';

import type { IBot, IGameInspector } from '@/interfaces.js';

import { Side } from '@/core.js';

export interface IClient {
    getSide(): Side;
    getNumber(): number;
    playAsBot(bot: IBot, onJoin?: () => void): Promise<void>;
    play(callback: (inspector: IGameInspector) => Promise<Order[]>, onJoin?: () => void): Promise<void>;
}

import type { Order } from '@/generated/server.js';

import type { IBot } from '@/interfaces/bot.js';
import type { IGameInspector } from '@/interfaces/game-inspector.js';

import type { Side } from '@/core/side.js';

export interface IClient {
    getSide(): Side;
    getNumber(): number;
    playAsBot(bot: IBot, onJoin?: () => void): Promise<void>;
    play(callback: (inspector: IGameInspector) => Promise<Order[]>, onJoin?: () => void): Promise<void>;
}

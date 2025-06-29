import { Order } from '@/generated/server.js';

import { IBot } from '@/interfaces/bot.js';
import { IGameInspector } from '@/interfaces/game-inspector.js';
import { PlayerState } from '@/interfaces/player.js';

export class DummyStatue implements IBot {
    beforeActions(inspector: IGameInspector): void {}
    afterActions(inspector: IGameInspector): void {}
    onReady(inspector: IGameInspector): void {}

    onHolding(inspector: IGameInspector): Order[] {
        const orders: Order[] = [];

        return orders;
    }

    onDisputing(inspector: IGameInspector): Order[] {
        const orders: Order[] = [];

        return orders;
    }

    onDefending(inspector: IGameInspector): Order[] {
        const orders: Order[] = [];

        return orders;
    }

    onSupporting(inspector: IGameInspector): Order[] {
        const orders: Order[] = [];

        return orders;
    }

    asGoalkeeper(inspector: IGameInspector, state: PlayerState): Order[] {
        const orders: Order[] = [];

        return orders;
    }
}

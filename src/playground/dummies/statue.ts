import { Order } from '@/generated/server.js';

import { IBot } from '@/interfaces.js';

import { GameInspector, PlayerState } from '@/core.js';

export class DummyStatue implements IBot {
    beforeActions(inspector: GameInspector): void {}
    afterActions(inspector: GameInspector): void {}
    onReady(inspector: GameInspector): void {}

    onHolding(inspector: GameInspector): Order[] {
        const orders: Order[] = [];

        return orders;
    }

    onDisputing(inspector: GameInspector): Order[] {
        const orders: Order[] = [];

        return orders;
    }

    onDefending(inspector: GameInspector): Order[] {
        const orders: Order[] = [];

        return orders;
    }

    onSupporting(inspector: GameInspector): Order[] {
        const orders: Order[] = [];

        return orders;
    }

    asGoalkeeper(inspector: GameInspector, state: PlayerState): Order[] {
        const orders: Order[] = [];

        return orders;
    }
}

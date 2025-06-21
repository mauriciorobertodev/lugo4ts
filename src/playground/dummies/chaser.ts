import { Order } from '@/generated/server.js';

import { IBot } from '@/interfaces.js';

import { GameInspector, PlayerState } from '@/core.js';

export class DummyChaser implements IBot {
    beforeActions(inspector: GameInspector): void {}
    afterActions(inspector: GameInspector): void {}
    onReady(inspector: GameInspector): void {}

    onHolding(inspector: GameInspector): Order[] {
        return this.chaseBall(inspector);
    }

    onDisputing(inspector: GameInspector): Order[] {
        return this.chaseBall(inspector);
    }

    onDefending(inspector: GameInspector): Order[] {
        return this.chaseBall(inspector);
    }

    onSupporting(inspector: GameInspector): Order[] {
        return this.chaseBall(inspector);
    }

    asGoalkeeper(inspector: GameInspector, state: PlayerState): Order[] {
        return this.chaseBall(inspector);
    }

    private chaseBall(inspector: GameInspector): Order[] {
        const orders: Order[] = [];

        const order = inspector.makeOrderMoveToPoint(inspector.getBallPosition());

        orders.push(order);

        return orders;
    }
}

import { Order } from '@/generated/server.js';

import { IBot } from '@/interfaces/bot.js';
import { IGameInspector } from '@/interfaces/game-inspector.js';
import { PlayerState } from '@/interfaces/player.js';

export class DummyChaser implements IBot {
    beforeActions(inspector: IGameInspector): void {}
    afterActions(inspector: IGameInspector): void {}
    onReady(inspector: IGameInspector): void {}

    onHolding(inspector: IGameInspector): Order[] {
        return this.chaseBall(inspector);
    }

    onDisputing(inspector: IGameInspector): Order[] {
        return this.chaseBall(inspector);
    }

    onDefending(inspector: IGameInspector): Order[] {
        return this.chaseBall(inspector);
    }

    onSupporting(inspector: IGameInspector): Order[] {
        return this.chaseBall(inspector);
    }

    asGoalkeeper(inspector: IGameInspector, state: PlayerState): Order[] {
        return this.chaseBall(inspector);
    }

    private chaseBall(inspector: IGameInspector): Order[] {
        const orders: Order[] = [];

        const order = inspector.makeOrderMoveToPoint(inspector.getBallPosition());

        orders.push(order);

        return orders;
    }
}

import { Order } from '@/generated/server.js';

import { IBot, IPoint } from '@/interfaces.js';

import { GameInspector, PlayerState, Point, SPECS } from '@/core.js';

import '@/utils.js';
import { randomInt } from '@/utils.js';

export class DummyKicker implements IBot {
    private distanceToKick: number = this.generateDistanceToKick();

    beforeActions(inspector: GameInspector): void {}
    afterActions(inspector: GameInspector): void {}
    onReady(inspector: GameInspector): void {}

    onHolding(inspector: GameInspector): Order[] {
        const orders: Order[] = [];

        const me = inspector.getMe();
        const ball = inspector.getBall();
        const goal = inspector.getAttackGoal();
        const distance = ball.distanceToPoint(goal.getCenter());

        // console.log(`ball direction is my direction: ${me.getDirection().is(ball.getDirection())}`);

        if (distance <= this.distanceToKick) {
            const pointToKick = this.generatePointToKick(goal.getTopPole(), goal.getBottomPole());
            const order = inspector.makeOrderKickToPoint(pointToKick);
            orders.push(order);
            this.distanceToKick = this.generateDistanceToKick();
        } else {
            const order = inspector.makeOrderMoveToPoint(goal.getCenter());
            orders.push(order);
        }

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

    private generateDistanceToKick(): number {
        const MIN_DISTANCE_TO_GOAL = SPECS.GOAL_ZONE_RANGE;
        const MAX_DISTANCE_TO_GOAL = SPECS.GOAL_ZONE_RANGE * 5;

        return randomInt(MIN_DISTANCE_TO_GOAL, MAX_DISTANCE_TO_GOAL);
    }

    private generatePointToKick(topPole: IPoint, bottomPole: IPoint): Point {
        const x = topPole.getX();
        const y = randomInt(topPole.getY(), bottomPole.getY());

        return new Point(x, y);
    }
}

import { Order } from '@/generated/server.js';

import { IBot } from '@/interfaces/bot.js';
import { IGameInspector } from '@/interfaces/game-inspector.js';
import { IPoint } from '@/interfaces/positionable.js';

import { PlayerState } from '@/core/player.js';
import { Point } from '@/core/point.js';
import { SPECS } from '@/core/specs.js';

import { randomInt } from '@/utils/random.js';

export class DummyKicker implements IBot {
    private distanceToKick: number = this.generateDistanceToKick();

    beforeActions(inspector: IGameInspector): void {}
    afterActions(inspector: IGameInspector): void {}
    onReady(inspector: IGameInspector): void {}

    onHolding(inspector: IGameInspector): Order[] {
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

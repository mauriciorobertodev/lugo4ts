import { GoalObject, IGoal } from '@/interfaces/goal.js';
import { IPoint } from '@/interfaces/positionable.js';

import { Point } from '@/core/point.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';

export class Goal implements IGoal {
    constructor(
        protected side: Side,
        protected center: Point,
        protected topPole: Point,
        protected bottomPole: Point
    ) {}

    getCenter(): Point {
        return this.center;
    }

    getSide(): Side {
        return this.side;
    }

    getTopPole(): Point {
        return this.topPole;
    }

    getBottomPole(): Point {
        return this.bottomPole;
    }

    clone(): Goal {
        return new Goal(
            this.side,
            new Point(this.center.getX(), this.center.getY()),
            new Point(this.topPole.getX(), this.topPole.getY()),
            new Point(this.bottomPole.getX(), this.bottomPole.getY())
        );
    }

    toObject(): GoalObject {
        return {
            side: this.side,
            center: this.center.toObject(),
            topPole: this.topPole.toObject(),
            bottomPole: this.bottomPole.toObject(),
        };
    }
}

export const HOME_GOAL: Goal = new Goal(
    Side.HOME,
    new Point(0, SPECS.MAX_Y_COORDINATE / 2),
    new Point(0, SPECS.GOAL_MAX_Y),
    new Point(0, SPECS.GOAL_MIN_Y)
);

export const AWAY_GOAL: Goal = new Goal(
    Side.AWAY,
    new Point(SPECS.MAX_X_COORDINATE, SPECS.MAX_Y_COORDINATE / 2),
    new Point(SPECS.MAX_X_COORDINATE, SPECS.GOAL_MAX_Y),
    new Point(SPECS.MAX_X_COORDINATE, SPECS.GOAL_MIN_Y)
);

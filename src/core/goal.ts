import { IGoal } from '@/interfaces/goal.js';
import { IPoint } from '@/interfaces/positionable.js';

import { Point } from '@/core/point.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';

export class Goal implements IGoal {
    constructor(
        protected place: Side,
        protected center: Point,
        protected topPole: Point,
        protected bottomPole: Point
    ) {}

    getCenter(): Point {
        return this.center;
    }

    getSide(): Side {
        return this.place;
    }

    getTopPole(): Point {
        return this.topPole;
    }

    getBottomPole(): Point {
        return this.bottomPole;
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

import { Point, SPECS, Side } from '@/core.js';
import type { IGoal, IPoint } from '@/interfaces.js';

export class Goal implements IGoal {
    constructor(
        protected place: Side,
        protected center: IPoint,
        protected topPole: IPoint,
        protected bottomPole: IPoint
    ) {}

    getCenter(): IPoint {
        return this.center;
    }

    getSide(): Side {
        return this.place;
    }

    getTopPole(): IPoint {
        return this.topPole;
    }

    getBottomPole(): IPoint {
        return this.bottomPole;
    }
}

export const HOME_GOAL: IGoal = new Goal(
    Side.HOME,
    new Point(0, SPECS.MAX_Y_COORDINATE / 2),
    new Point(0, SPECS.GOAL_MAX_Y),
    new Point(0, SPECS.GOAL_MIN_Y)
);

export const AWAY_GOAL: IGoal = new Goal(
    Side.AWAY,
    new Point(SPECS.MAX_X_COORDINATE, SPECS.MAX_Y_COORDINATE / 2),
    new Point(SPECS.MAX_X_COORDINATE, SPECS.GOAL_MAX_Y),
    new Point(SPECS.MAX_X_COORDINATE, SPECS.GOAL_MIN_Y)
);

import type { IGoal } from '../interfaces/goal.ts';

import { Point } from './point.js';
import { Side } from './side.js';

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

    getPlace(): Side {
        return this.place;
    }

    getTopPole(): Point {
        return this.topPole;
    }

    getBottomPole(): Point {
        return this.bottomPole;
    }
}

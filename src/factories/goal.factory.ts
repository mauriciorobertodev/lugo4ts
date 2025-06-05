import { Goal } from '../core/goal.js';
import { Point } from '../core/point.js';
import { Side } from '../core/side.js';
import { SPECS } from '../core/specs.js';

export class GoalFactory {
    static HOME(): Goal {
        return new Goal(
            Side.HOME,
            new Point(0, SPECS.MAX_Y_COORDINATE / 2),
            new Point(0, SPECS.GOAL_MAX_Y),
            new Point(0, SPECS.GOAL_MIN_Y)
        );
    }

    static AWAY(): Goal {
        return new Goal(
            Side.AWAY,
            new Point(SPECS.MAX_X_COORDINATE, SPECS.MAX_Y_COORDINATE / 2),
            new Point(SPECS.MAX_X_COORDINATE, SPECS.GOAL_MAX_Y),
            new Point(SPECS.MAX_X_COORDINATE, SPECS.GOAL_MIN_Y)
        );
    }
}

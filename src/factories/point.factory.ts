import { Point as LugoPoint, Vector as LugoVector } from '../generated/physics.js';

import { Point } from '../core/point.js';
import { Side } from '../core/side.js';
import { SPECS } from '../core/specs.js';
import { Util } from '../core/util.js';
import { GoalFactory } from './goal.factory.js';

export class PointFactory {
    static create({ x = 0, y = 0 }): Point {
        return new Point(x, y);
    }

    static fromLugoPoint(lugoPoint: LugoPoint): Point {
        return new Point(lugoPoint.x, lugoPoint.y);
    }

    static fromLugoVector(lugoVector: LugoVector): Point {
        return new Point(lugoVector.x, lugoVector.y);
    }

    static random({ x, y }: { x?: number; y?: number } = {}): Point {
        const randomX = x ?? Util.randomInt(0, SPECS.MAX_X_COORDINATE);
        const randomY = y ?? Util.randomInt(0, SPECS.MAX_Y_COORDINATE);
        return new Point(randomX, randomY);
    }

    static randomPointBetweenGoalPoles(side: Side): Point {
        const goal = side === Side.HOME ? GoalFactory.HOME() : GoalFactory.AWAY();
        const top = goal.getTopPole();
        const bottom = goal.getBottomPole();

        const minY = Math.min(top.getY(), bottom.getY());
        const maxY = Math.max(top.getY(), bottom.getY());
        const randomY = minY + Math.random() * (maxY - minY);

        return new Point(top.getX(), randomY);
    }
}

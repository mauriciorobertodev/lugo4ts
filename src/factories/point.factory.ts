import { Point as LugoPoint, Vector as LugoVector } from '../generated/physics.js';

import { Point } from '../core/point.js';

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
}

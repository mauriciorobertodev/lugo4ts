import { Point as LugoPoint, Vector as LugoVector } from '../generated/physics.js';

import { Util } from '../core/util.js';
import { Vector2D } from '../core/vector.js';

export class VectorFactory {
    static create({ x = 0, y = 0 }): Vector2D {
        return new Vector2D(x, y);
    }

    static fromLugoPoint(lugoPoint: LugoPoint): Vector2D {
        return new Vector2D(lugoPoint.x, lugoPoint.y);
    }

    static fromLugoVector(lugoVector: LugoVector): Vector2D {
        return new Vector2D(lugoVector.x, lugoVector.y);
    }

    static random(): Vector2D {
        const x = Util.randomFloat(-1, 1);
        const y = Util.randomFloat(-1, 1);
        return new Vector2D(x, y).normalize();
    }
}

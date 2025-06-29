import { Vector2DObject } from '@/interfaces/positionable.js';

import { Point } from '@/core/point.js';
import { Vector2D } from '@/core/vector.js';

import { randomFloat } from '@/utils/random.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function vector2DToPoint(vector: Vector2D): Point {
    return new Point(vector.getX(), vector.getY());
}

export function fromVector2DObject(obj: Vector2DObject): Vector2D {
    return new Vector2D(obj.x, obj.y);
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedVector(): Vector2D {
    return new Vector2D(0, 0);
}

export function randomVector2D(): Vector2D {
    const x = randomFloat(-1, 1);
    const y = randomFloat(-1, 1);
    return new Vector2D(x, y).normalize();
}

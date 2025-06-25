// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------
import { IPoint, IVector2D } from '@/interfaces/positionable.js';

import { Point } from '@/core/point.js';
import { Vector2D } from '@/core/vector.js';

import { randomFloat } from '@/utils/random.js';

export function vector2DToPoint(vector: IVector2D): IPoint {
    return new Point(vector.getX(), vector.getY());
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedVector(): IVector2D {
    return new Vector2D(0, 0);
}

export function randomVector2D(): Vector2D {
    const x = randomFloat(-1, 1);
    const y = randomFloat(-1, 1);
    return new Vector2D(x, y).normalize();
}

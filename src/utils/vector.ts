import { IPoint, IVector2D } from '@/interfaces.js';

import { Vector2D } from '@/core.js';

import { randomFloat } from '@/utils.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function vector2DToPoint(vector: IVector2D): IPoint {
    return new Vector2D(vector.getX(), vector.getY());
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

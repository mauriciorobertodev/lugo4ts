import type { IVector2D } from '../interfaces/positionable.js';

import { IsPositionable } from './positionable.js';

export class Vector2D extends IsPositionable implements IVector2D {
    constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
    }

    clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }
}

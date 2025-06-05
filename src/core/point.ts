import type { IPoint } from '../interfaces/positionable.ts';

import { IsPositionable } from './positionable.js';

export class Point extends IsPositionable implements IPoint {
    constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
    }

    clone(): Point {
        return new Point(this.x, this.y);
    }
}

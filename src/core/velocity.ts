import type { IVector2D, IVelocity } from '@/interfaces.js';

import { Vector2D } from '@/core/vector.js';

export class Velocity implements IVelocity {
    constructor(
        private direction: IVector2D = new Vector2D(),
        private speed: number = 0
    ) {}

    getDirection(): IVector2D {
        return this.direction;
    }

    setDirection(direction: IVector2D): this {
        this.direction = direction;
        return this;
    }

    getSpeed(): number {
        return this.speed;
    }

    setSpeed(speed: number): this {
        this.speed = speed;
        return this;
    }

    toString(): string {
        return `[${this.direction.getX()}, ${this.direction.getY()}, ${this.speed}]`;
    }
}

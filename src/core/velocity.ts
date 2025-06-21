import { Vector2D } from '@/core.js';
import type { IVector2D, IVelocity } from '@/interfaces.js';

import { Velocity as LugoVelocity } from '@/generated/physics.js';

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

    toLugoVelocity(): LugoVelocity {
        return LugoVelocity.create({ speed: this.speed, direction: this.direction.toLugoVector() });
    }

    toString(): string {
        return `[${this.direction.getX()}, ${this.direction.getY()}, ${this.speed}]`;
    }
}

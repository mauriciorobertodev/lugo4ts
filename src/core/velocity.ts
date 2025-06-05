import { Velocity as LugoVelocity } from '../generated/physics.js';

import type { IVelocity } from '../interfaces/velocity.ts';

import { Vector2D } from './vector.js';

export class Velocity implements IVelocity {
    constructor(
        private direction: Vector2D = new Vector2D(),
        private speed: number = 0
    ) {}

    getDirection(): Vector2D {
        return this.direction;
    }

    setDirection(direction: Vector2D): this {
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

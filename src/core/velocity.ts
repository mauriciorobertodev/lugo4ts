import { IVelocity, VelocityObject } from '@/interfaces/velocity.js';

import { Vector2D } from '@/core/vector.js';

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

    toString(): string {
        return `[${this.direction.getX()}, ${this.direction.getY()}, ${this.speed}]`;
    }

    clone(): Velocity {
        return new Velocity(this.direction.clone(), this.speed);
    }

    toObject(): VelocityObject {
        return {
            direction: this.direction.toObject(),
            speed: this.speed,
        };
    }
}

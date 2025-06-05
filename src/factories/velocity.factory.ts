import { Vector as LugoVector, Velocity as LugoVelocity } from '../generated/physics.js';

import { Vector2D } from '../core/vector.js';
import { Velocity } from '../core/velocity.js';
import { VectorFactory } from './vector.factory.js';

export class VelocityFactory {
    static newZeroed(): Velocity {
        return new Velocity(new Vector2D(), 0);
    }

    static fromLugoVelocity(lugoVelocity: LugoVelocity): Velocity {
        return new Velocity(
            VectorFactory.fromLugoVector(lugoVelocity.direction ?? LugoVector.create()).normalize(),
            lugoVelocity.speed
        );
    }

    static fromDirectionAndSpeed(direction: Vector2D, speed: number): Velocity {
        return new Velocity(direction.normalize(), speed);
    }
}

import { VelocityObject } from '@/interfaces/velocity.js';

import { SPECS } from '@/core/specs.js';
import { Vector2D } from '@/core/vector.js';
import { Velocity } from '@/core/velocity.js';

import { randomFloat } from '@/utils/random.js';
import { fromVector2DObject, randomVector2D } from '@/utils/vector.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function fromVelocityObject(obj: VelocityObject): Velocity {
    return new Velocity(fromVector2DObject(obj.direction), obj.speed);
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedVelocity({}: {
    direction?: Vector2D;
    speed?: number;
    maxSpeed?: number;
} = {}): Velocity {
    return new Velocity(new Vector2D(0, 0), 0);
}

export function randomVelocity({
    direction = randomVector2D(),
    speed,
    maxSpeed = SPECS.PLAYER_MAX_SPEED,
}: { direction?: Vector2D; speed?: number; maxSpeed?: number } = {}): Velocity {
    const velocity = new Velocity(direction.normalize(), speed ?? randomFloat(0, maxSpeed));
    return velocity;
}

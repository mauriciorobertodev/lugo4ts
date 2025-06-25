// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------
import { IVector2D } from '@/interfaces/positionable.js';
import { IVelocity } from '@/interfaces/velocity.js';

import { SPECS } from '@/core/specs.js';
import { Vector2D } from '@/core/vector.js';
import { Velocity } from '@/core/velocity.js';

import { randomFloat } from '@/utils/random.js';
import { randomVector2D } from '@/utils/vector.js';

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedVelocity({}: {
    direction?: IVector2D;
    speed?: number;
    maxSpeed?: number;
} = {}): IVelocity {
    return new Velocity(new Vector2D(0, 0), 0);
}

export function randomVelocity({
    direction = randomVector2D(),
    speed,
    maxSpeed = SPECS.PLAYER_MAX_SPEED,
}: { direction?: IVector2D; speed?: number; maxSpeed?: number } = {}): IVelocity {
    const velocity = new Velocity(direction.normalize(), speed ?? randomFloat(0, maxSpeed));
    return velocity;
}

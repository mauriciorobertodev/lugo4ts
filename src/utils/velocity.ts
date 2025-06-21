import { IVector2D, IVelocity } from '@/interfaces.js';

import { SPECS, Vector2D, Velocity } from '@/core.js';

import { randomFloat, randomVector2D } from '@/utils.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

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

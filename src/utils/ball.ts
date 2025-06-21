import { IBall, IPlayer, IPoint, IVector2D } from '@/interfaces.js';

import { Ball, SPECS } from '@/core.js';

import { fieldCenterPoint, randomPoint, randomVelocity, zeroedVelocity } from '@/utils.js';

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedBall(): IBall {
    return new Ball(fieldCenterPoint(), zeroedVelocity(), null);
}

export function randomBall({
    holder = null,
    position = randomPoint(),
    direction,
    speed,
    maxSpeed = SPECS.BALL_MAX_SPEED,
}: {
    holder?: IPlayer | null;
    position?: IPoint;
    direction?: IVector2D;
    speed?: number;
    maxSpeed?: number;
} = {}): IBall {
    const velocity = randomVelocity({ direction, speed, maxSpeed });
    return new Ball(position, velocity, holder);
}

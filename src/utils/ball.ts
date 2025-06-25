// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------
import { IBall } from '@/interfaces/ball.js';
import { IPlayer } from '@/interfaces/player.js';
import { IPoint, IVector2D } from '@/interfaces/positionable.js';

import { Ball } from '@/core/ball.js';
import { SPECS } from '@/core/specs.js';

import { fieldCenterPoint } from '@/utils/field.js';
import { randomPoint } from '@/utils/point.js';
import { randomVelocity, zeroedVelocity } from '@/utils/velocity.js';

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

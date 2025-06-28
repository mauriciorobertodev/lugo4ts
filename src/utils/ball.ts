// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------
import { Ball } from '@/core/ball.js';
import { Player } from '@/core/player.js';
import { Point } from '@/core/point.js';
import { SPECS } from '@/core/specs.js';
import { Vector2D } from '@/core/vector.js';

import { fieldCenterPoint } from '@/utils/field.js';
import { randomPoint } from '@/utils/point.js';
import { randomVelocity, zeroedVelocity } from '@/utils/velocity.js';

export function zeroedBall(): Ball {
    return new Ball(fieldCenterPoint(), zeroedVelocity(), null);
}

export function randomBall({
    holder = null,
    position = randomPoint(),
    direction,
    speed,
    maxSpeed = SPECS.BALL_MAX_SPEED,
}: {
    holder?: Player | null;
    position?: Point;
    direction?: Vector2D;
    speed?: number;
    maxSpeed?: number;
} = {}): Ball {
    const velocity = randomVelocity({ direction, speed, maxSpeed });
    return new Ball(position, velocity, holder);
}

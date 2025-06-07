import type { Ball as LugoBall } from '../generated/server.js';

import { Ball } from '../core/ball.js';
import { Player } from '../core/player.js';
import { Point } from '../core/point.js';
import { SPECS } from '../core/specs.js';
import { Vector2D } from '../core/vector.js';
import { PlayerFactory } from './player.factory.js';
import { PointFactory } from './point.factory.js';
import { VelocityFactory } from './velocity.factory.js';

export class BallFactory {
    static fromLugoBall(lugoBall: LugoBall): Ball {
        return new Ball(
            lugoBall.position
                ? PointFactory.fromLugoPoint(lugoBall.position)
                : new Point(SPECS.FIELD_CENTER_X, SPECS.FIELD_CENTER_Y),
            lugoBall.velocity ? VelocityFactory.fromLugoVelocity(lugoBall.velocity) : VelocityFactory.newZeroed(),
            lugoBall.holder ? PlayerFactory.fromLugoPlayer(lugoBall.holder) : null
        );
    }

    static newZeroed(): Ball {
        return new Ball(new Point(SPECS.FIELD_CENTER_X, SPECS.FIELD_CENTER_Y), VelocityFactory.newZeroed(), null);
    }

    static random({
        holder = null,
        position = PointFactory.random(),
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
        const velocity = VelocityFactory.random({ direction, speed, maxSpeed });
        return new Ball(position, velocity, holder);
    }
}

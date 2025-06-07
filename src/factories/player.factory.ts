import { Point as LugoPoint, Velocity as LugoVelocity } from '../generated/physics.js';
import { Player as LugoPlayer, Team_Side } from '../generated/server.js';

import { ErrPlayerInvalidState } from '../core/errors.js';
import { Player, PlayerState } from '../core/player.js';
import { Point } from '../core/point.js';
import { Side } from '../core/side.js';
import { SPECS } from '../core/specs.js';
import { Util } from '../core/util.js';
import { Vector2D } from '../core/vector.js';
import { PointFactory } from './point.factory.js';
import { VectorFactory } from './vector.factory.js';
import { VelocityFactory } from './velocity.factory.js';

export class PlayerFactory {
    static fromLugoPlayer(lugoPlayer: LugoPlayer): Player {
        return new Player(
            lugoPlayer.number,
            lugoPlayer.isJumping,
            lugoPlayer.teamSide === Team_Side.HOME ? Side.HOME : Side.AWAY,
            PointFactory.fromLugoPoint(lugoPlayer.position ?? LugoPoint.create()),
            PointFactory.fromLugoPoint(lugoPlayer.initPosition ?? LugoPoint.create()),
            VelocityFactory.fromLugoVelocity(lugoPlayer.velocity ?? LugoVelocity.create())
        );
    }

    static random({
        number = Util.randomInt(1, SPECS.MAX_PLAYERS),
        side = Side.HOME,
        position,
        direction = VectorFactory.random(),
        speed,
        maxSpeed = SPECS.PLAYER_MAX_SPEED,
        isJumping = false,
    }: {
        number?: number;
        side?: Side;
        position?: Point;
        direction?: Vector2D;
        speed?: number;
        maxSpeed?: number;
        isJumping?: boolean;
    } = {}): Player {
        const isGoalkeeper = number === SPECS.GOALKEEPER_NUMBER;
        const velocity = VelocityFactory.random({ direction, speed, maxSpeed });
        position = position ?? (isGoalkeeper ? PointFactory.randomPointBetweenGoalPoles(side) : PointFactory.random());
        return new Player(number, isJumping, side, position, position, velocity);
    }
}

export class PlayerStateFactory {
    static fromString(value: string): PlayerState {
        switch (value.toLowerCase()) {
            case 'supporting':
                return PlayerState.SUPPORTING;
            case 'holding':
                return PlayerState.HOLDING;
            case 'defending':
                return PlayerState.DEFENDING;
            case 'disputing':
                return PlayerState.DISPUTING;
            default:
                throw new ErrPlayerInvalidState(value);
        }
    }

    static random(): PlayerState {
        const states = Object.values(PlayerState);
        return states[Util.randomInt(0, states.length - 1)];
    }
}

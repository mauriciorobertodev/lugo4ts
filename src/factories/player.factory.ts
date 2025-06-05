import { Point, Velocity } from '../generated/physics.js';
import { Player as LugoPlayer, Team_Side } from '../generated/server.js';

import { ErrPlayerInvalidState } from '../core/errors.js';
import { Player, PlayerState } from '../core/player.js';
import { Side } from '../core/side.js';
import { PointFactory } from './point.factory.js';
import { VelocityFactory } from './velocity.factory.js';

export class PlayerFactory {
    static fromLugoPlayer(lugoPlayer: LugoPlayer): Player {
        return new Player(
            lugoPlayer.number,
            lugoPlayer.isJumping,
            lugoPlayer.teamSide === Team_Side.HOME ? Side.HOME : Side.AWAY,
            PointFactory.fromLugoPoint(lugoPlayer.position ?? Point.create()),
            PointFactory.fromLugoPoint(lugoPlayer.initPosition ?? Point.create()),
            VelocityFactory.fromLugoVelocity(lugoPlayer.velocity ?? Velocity.create())
        );
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
}

import { PlayerObject, PlayerState } from '@/interfaces/player.js';

import { Player } from '@/core/player.js';
import { Point } from '@/core/point.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';
import { Vector2D } from '@/core/vector.js';
import { Velocity } from '@/core/velocity.js';

import { goalFromSide } from '@/utils/goal.js';
import {
    fromPointObject,
    randomInitialPosition,
    randomPointBetweenGoalPoles,
    randomPointInField,
} from '@/utils/point.js';
import { randomElement, randomInt } from '@/utils/random.js';
import { randomVector2D } from '@/utils/vector.js';
import { fromVelocityObject, randomVelocity } from '@/utils/velocity.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function fromPlayerObject(obj: PlayerObject): Player {
    return new Player(
        obj.number,
        obj.isJumping,
        obj.side,
        fromPointObject(obj.position),
        fromPointObject(obj.initPosition),
        fromVelocityObject(obj.velocity)
    );
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedPlayer(): Player {
    return new Player(0, false, Side.HOME, new Point(0, 0), new Point(0, 0), new Velocity(new Vector2D(0, 0), 0));
}

export function randomPlayer({
    number = randomInt(1, SPECS.MAX_PLAYERS),
    side = Side.HOME,
    position,
    initialPosition,
    direction = randomVector2D(),
    speed,
    maxSpeed = SPECS.PLAYER_MAX_SPEED,
    isJumping = false,
}: {
    number?: number;
    side?: Side;
    position?: Point;
    initialPosition?: Point;
    direction?: Vector2D;
    speed?: number;
    maxSpeed?: number;
    isJumping?: boolean;
} = {}): Player {
    const isGoalkeeper = number === SPECS.GOALKEEPER_NUMBER;
    const velocity = randomVelocity({ direction, speed, maxSpeed });
    const secondaryPosition = isGoalkeeper ? randomPointBetweenGoalPoles(goalFromSide(side)) : randomPointInField();
    const secondaryInitialPosition = isGoalkeeper
        ? randomPointBetweenGoalPoles(goalFromSide(side))
        : randomInitialPosition(side);
    position = position ?? secondaryPosition;
    initialPosition = initialPosition ?? secondaryInitialPosition;
    return new Player(number, isJumping, side, position, initialPosition, velocity);
}

export function randomPlayerState(): PlayerState {
    return randomElement([PlayerState.HOLDING, PlayerState.DEFENDING, PlayerState.DISPUTING, PlayerState.SUPPORTING]);
}

// ------------------------------------------------------------
// Validators
// ------------------------------------------------------------

/**
 *  Checks if the given player number is valid. the maximum number of players is defined in SPECS.MAX_PLAYERS
 *  @param playerNumber The player number to check.
 *  @returns True if the player number is valid, false otherwise.
 *  @example
 *  isValidPlayerNumber(1); // true
 *  isValidPlayerNumber(99); // false
 */
export function isValidPlayerNumber(playerNumber: number): boolean {
    return playerNumber >= 1 && playerNumber <= SPECS.MAX_PLAYERS;
}

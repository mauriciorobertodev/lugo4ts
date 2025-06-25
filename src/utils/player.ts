// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------
import { IPlayer } from '@/interfaces/player.js';
import { IPoint, IVector2D } from '@/interfaces/positionable.js';

import { Player, PlayerState } from '@/core/player.js';
import { Point } from '@/core/point.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';
import { Vector2D } from '@/core/vector.js';
import { Velocity } from '@/core/velocity.js';

import { goalFromSide } from '@/utils/goal.js';
import { randomInitialPosition, randomPointBetweenGoalPoles } from '@/utils/point.js';
import { randomElement, randomInt } from '@/utils/random.js';
import { randomVector2D } from '@/utils/vector.js';
import { randomVelocity } from '@/utils/velocity.js';

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedPlayer(): IPlayer {
    return new Player(0, false, Side.HOME, new Point(0, 0), new Point(0, 0), new Velocity(new Vector2D(0, 0), 0));
}

export function randomPlayer({
    number = randomInt(1, SPECS.MAX_PLAYERS),
    side = Side.HOME,
    position,
    direction = randomVector2D(),
    speed,
    maxSpeed = SPECS.PLAYER_MAX_SPEED,
    isJumping = false,
}: {
    number?: number;
    side?: Side;
    position?: IPoint;
    direction?: IVector2D;
    speed?: number;
    maxSpeed?: number;
    isJumping?: boolean;
} = {}): IPlayer {
    const isGoalkeeper = number === SPECS.GOALKEEPER_NUMBER;
    const velocity = randomVelocity({ direction, speed, maxSpeed });
    const secondaryPosition: IPoint = isGoalkeeper
        ? randomPointBetweenGoalPoles(goalFromSide(side))
        : randomInitialPosition(side);
    position = position ?? secondaryPosition;
    return new Player(number, isJumping, side, position, position, velocity);
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

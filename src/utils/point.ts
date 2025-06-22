import { IGoal, IPoint, IVector2D } from '@/interfaces.js';

import { AWAY_GOAL, HOME_GOAL, Point, SPECS, Side, Vector2D } from '@/core.js';

import { fieldCenterPoint, randomInt } from '@/utils.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function pointToVector2D(point: IPoint): IVector2D {
    return new Vector2D(point.getX(), point.getY());
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedPoint(): IPoint {
    return new Point(0, 0);
}

export function randomPoint({
    minX = 0,
    minY = 0,
    maxX = SPECS.MAX_X_COORDINATE,
    maxY = SPECS.MAX_Y_COORDINATE,
}: {
    minX?: number;
    minY?: number;
    maxX?: number;
    maxY?: number;
} = {}): Point {
    const randomX = randomInt(minX, maxX);
    const randomY = randomInt(minY, maxY);
    return new Point(randomX, randomY);
}

export function randomPointInField(): IPoint {
    const randomX = randomInt(0, SPECS.MAX_X_COORDINATE);
    const randomY = randomInt(0, SPECS.MAX_Y_COORDINATE);
    return new Point(randomX, randomY);
}

export function randomPointInSide(side: Side): IPoint {
    const minX = side === Side.HOME ? 0 : SPECS.MAX_X_COORDINATE / 2;
    const maxX = side === Side.HOME ? SPECS.MAX_X_COORDINATE / 2 - 1 : SPECS.MAX_X_COORDINATE;
    const randomX = randomInt(minX, maxX);
    const randomY = randomInt(0, SPECS.MAX_Y_COORDINATE);
    return new Point(randomX, randomY);
}

export function randomInitialPosition(side: Side): IPoint {
    const position = randomPointInSide(side);

    if (!isValidInitialPosition(position)) {
        return randomInitialPosition(side);
    }

    return position;
}

export function randomPointBetween(a: IPoint, b: IPoint): IPoint {
    const x = randomInt(Math.min(a.getX(), b.getX()), Math.max(a.getX(), b.getX()));
    const y = randomInt(Math.min(a.getY(), b.getY()), Math.max(a.getY(), b.getY()));
    return new Point(x, y);
}

export function randomPointBetweenGoalPoles(goal: IGoal): IPoint {
    const top = goal.getTopPole();
    const bottom = goal.getBottomPole();

    const minY = Math.min(top.getY(), bottom.getY());
    const maxY = Math.max(top.getY(), bottom.getY());
    const randomY = minY + Math.random() * (maxY - minY);

    return new Point(top.getX(), randomY);
}

// ------------------------------------------------------------
// Validators
// ------------------------------------------------------------

export function isValidInitialPosition(position: IPoint): boolean {
    // se está dentro do círculo central, não é válido,pois é região neutra
    if (position.distanceTo(fieldCenterPoint()) <= SPECS.FIELD_CENTER_RADIUS) {
        return false;
    }

    // se ele está mais distante da linha de gol do que o range da zona de gol, é válido porque é impossível que ele esteja na zona de gol
    // se ele está mais distante da linha de gol do que o range da zona de gol, é válido
    if (position.getX() > SPECS.GOAL_ZONE_RANGE && position.getX() < SPECS.MAX_X_COORDINATE - SPECS.GOAL_ZONE_RANGE) {
        return true;
    }

    // se ele está entre as linhas de gol, não é válido
    if (position.getY() >= SPECS.GOAL_MIN_Y && position.getY() <= SPECS.GOAL_MAX_Y) {
        return false;
    }

    const goalPoles = [
        HOME_GOAL.getTopPole(),
        HOME_GOAL.getBottomPole(),
        AWAY_GOAL.getTopPole(),
        AWAY_GOAL.getBottomPole(),
    ];

    for (const pole of goalPoles) {
        if (position.distanceTo(pole) <= SPECS.GOAL_ZONE_RANGE) {
            return false;
        }
    }

    return true;
}

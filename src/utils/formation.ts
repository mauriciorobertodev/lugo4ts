import { FormationObject, IFormation } from '@/interfaces.js';

import { Formation, FormationType, SPECS, Side } from '@/core.js';

import { createMapperFromObject, isValidPlayerNumber, randomInitialPosition, randomInt, randomSide } from '@/utils.js';

import { ErrFormationInvalidPlayerNumber } from '@/errors.js';

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function fromFormationObject({ name, side, positions, type, mapper }: FormationObject): Formation {
    const formation = new Formation({}, name, side, type, mapper ? createMapperFromObject(mapper) : undefined);

    for (const keyStr in positions) {
        const playerNumber = parseInt(keyStr, 10);

        if (!isValidPlayerNumber(playerNumber)) {
            throw new ErrFormationInvalidPlayerNumber(playerNumber);
        }

        const position = positions[playerNumber];

        formation.definePositionOf(playerNumber, position[0], position[1]);
    }

    return formation;
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedFormation() {
    return new Formation();
}

export function randomFormation({
    side = randomSide(),
    positions = {},
    maxX = SPECS.MAX_X_COORDINATE,
    maxY = SPECS.MAX_Y_COORDINATE,
    minX = 0,
    minY = 0,
    maxPlayers = SPECS.MAX_PLAYERS,
    minPlayers = SPECS.MAX_PLAYERS,
    type = FormationType.POINTS,
}: {
    side?: Side;
    positions?: Record<number, [number, number]>;
    maxX?: number;
    maxY?: number;
    minX?: number;
    minY?: number;
    maxPlayers?: number;
    minPlayers?: number;
    type?: FormationType;
} = {}): IFormation {
    if (minX > maxX || minY > maxY) {
        throw new Error('O mínimo deve ser menor ou igual ao máximo para X e Y.');
    }

    const formation = new Formation(undefined, undefined, side, undefined);

    const playerCount = randomInt(minPlayers, maxPlayers);

    for (let i = 1; i <= playerCount; i++) {
        if (positions[i]) {
            const [x, y] = positions[i];
            formation.definePositionOf(i, x, y);
            continue;
        }
        formation.definePositionOf(i, randomInt(minX, maxX), randomInt(minY, maxY));
    }

    return formation;
}

export function randomStartFormation(side: Side = randomSide()): IFormation {
    const formation = randomFormation();

    for (let i = 1; i <= SPECS.MAX_PLAYERS; i++) {
        formation.setPositionOf(i, randomInitialPosition(side));
    }

    return formation;
}

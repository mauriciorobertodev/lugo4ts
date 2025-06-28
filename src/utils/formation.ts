import { FormationObject } from '@/interfaces/formation.js';

import { Formation, FormationType } from '@/core/formation.js';
import { Mapper } from '@/core/mapper.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';

import { createMapperFromObject } from '@/utils/mapper.js';
import { isValidPlayerNumber } from '@/utils/player.js';
import { randomInitialPosition } from '@/utils/point.js';
import { randomInt } from '@/utils/random.js';
import { randomSide } from '@/utils/side.js';

import { ErrFormationInvalidPlayerNumber } from '@/errors.js';

// ------------------------------------------------------------
// Converters
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
    mapper = undefined,
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
    mapper?: Mapper | null;
} = {}): Formation {
    const formation = new Formation(undefined, undefined, side, type, mapper);

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

export function randomStartFormation(side: Side = randomSide()): Formation {
    const formation = randomFormation();

    for (let i = 1; i <= SPECS.MAX_PLAYERS; i++) {
        formation.setPositionOf(i, randomInitialPosition(side));
    }

    return formation;
}

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------
import { MapperObject } from '@/interfaces/mapper.js';

import { Mapper } from '@/core/mapper.js';
import { Side } from '@/core/side.js';

import { randomInt } from '@/utils/random.js';

export function createMapperFromObject({ cols, rows, side }: MapperObject): Mapper {
    return new Mapper(cols, rows, side);
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedMapper(): Mapper {
    return new Mapper(4, 2, Side.HOME);
}

export function randomMapper({
    minCols = 4,
    maxCols = 200,
    minRows = 2,
    maxRows = 100,
    side = Side.HOME,
}: {
    minCols?: number;
    maxCols?: number;
    minRows?: number;
    maxRows?: number;
    side?: Side;
} = {}): Mapper {
    return new Mapper(randomInt(minCols, maxCols), randomInt(minRows, maxRows), side);
}

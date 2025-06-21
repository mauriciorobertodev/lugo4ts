import { IMapper, MapperObject } from '@/interfaces.js';

import { Mapper, Side } from '@/core.js';

import { randomInt } from '@/utils.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function createMapperFromObject({ cols, rows, side }: MapperObject): IMapper {
    return new Mapper(cols, rows, side);
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedMapper(): IMapper {
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
} = {}): IMapper {
    return new Mapper(randomInt(minCols, maxCols), randomInt(minRows, maxRows), side);
}

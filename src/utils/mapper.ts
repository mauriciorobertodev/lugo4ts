import { Mapper } from "@/core/mapper.js";
import type { MapperObject } from "@/interfaces/mapper.js";

import { randomInt } from "@/utils/random.js";

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function fromMapperObject(obj: MapperObject): Mapper {
	return new Mapper(obj.cols, obj.rows);
}

export function fromMapperJsonString(json: string): Mapper {
	const obj = JSON.parse(json) as MapperObject;
	return fromMapperObject(obj);
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedMapper(): Mapper {
	return new Mapper(4, 2);
}

export function randomMapper({
	minCols = 4,
	maxCols = 200,
	minRows = 2,
	maxRows = 100,
}: {
	minCols?: number;
	maxCols?: number;
	minRows?: number;
	maxRows?: number;
} = {}): Mapper {
	return new Mapper(randomInt(minCols, maxCols), randomInt(minRows, maxRows));
}

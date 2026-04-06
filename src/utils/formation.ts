import { Formation } from "@/core/formation.js";
import type { Mapper } from "@/core/mapper.js";
import { Point } from "@/core/point.js";
import type { Side } from "@/core/side.js";
import { SPECS } from "@/core/specs.js";
import { ErrFormationInvalidPlayerNumber } from "@/errors.js";
import { type FormationObject, FormationType } from "@/interfaces/formation.js";
import { isValidPlayerNumber } from "@/utils/player.js";
import { randomInitialPosition } from "@/utils/point.js";
import { randomInt, randomUUID } from "@/utils/random.js";
import { randomSide } from "@/utils/side.js";

import { fromMapperObject } from "./mapper.js";

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function fromFormationObject({ name, positions, type, mapper, id }: FormationObject): Formation {
	const formation = new Formation({}, name, type, mapper ? fromMapperObject(mapper) : undefined, id);

	for (const keyStr in positions) {
		const playerNumber = parseInt(keyStr, 10);

		if (!isValidPlayerNumber(playerNumber)) {
			throw new ErrFormationInvalidPlayerNumber(playerNumber);
		}

		const position = positions[playerNumber];

		formation.definePositionOf(playerNumber, position[0], position[1]);
	}

	if (mapper) formation.setType(FormationType.REGIONS);

	return formation;
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedFormation() {
	return new Formation();
}

export function randomFormation({
	id = randomUUID(),
	name = "?????",
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
	id?: string;
	name?: string;
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
	const formation = new Formation(undefined, name, type, mapper, id);

	if (mapper) {
		formation.setType(FormationType.REGIONS);
		maxX = mapper.getCols() - 1;
		minX = Math.max(minX, 0);
		maxY = mapper.getRows() - 1;
		minY = Math.max(minY, 0);
	}

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

export function makeFormation({
	positions = {},
	type = FormationType.POINTS,
	mapper = undefined,
	name = "?????",
	id = randomUUID(),
}: {
	id?: string;
	positions?: Record<number, [number, number]>;
	type?: FormationType;
	mapper?: Mapper | null;
	name?: string;
}) {
	const points: Record<number, Point> = {};
	for (const [playerNumber, [x, y]] of Object.entries(positions)) {
		points[parseInt(playerNumber, 10)] = new Point(x, y);
	}
	return new Formation(points, name, type, mapper, id);
}

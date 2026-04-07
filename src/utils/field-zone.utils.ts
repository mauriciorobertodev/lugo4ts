// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

import { FieldZone } from "@/core/field-zone.js";
import type { FieldZoneObject } from "@/interfaces/field-zone.interface.js";

import { fromFormationObject } from "./formation.utils.js";
import { randomUUID } from "./random.utils.js";

export function fromFieldZoneObject({ id = randomUUID(), name = "?????", start, end, formation }: FieldZoneObject): FieldZone {
	return new FieldZone(name, start.col, end.col, start.row, end.row, fromFormationObject(formation), id);
}

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------
import { TacticsObject } from "@/interfaces/tactics.js";

import { FieldZone } from "@/core/field-zone.js";
import { Tactics } from "@/core/tactics.js";

import { fromFieldZoneObject } from "@/utils/field-zone.js";
import { fromFormationObject } from "@/utils/formation.js";

export function fromTacticsObject({ initialFormation, fieldZones = [], formations = [] }: TacticsObject): Tactics {
	return new Tactics(
		fromFormationObject(initialFormation),
		fieldZones.map((o) => fromFieldZoneObject(o)),
		formations.map((o) => fromFormationObject(o)),
	);
}

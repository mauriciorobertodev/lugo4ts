// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

import { Tactics } from "@/core/tactics.js";
import type { TacticsObject } from "@/interfaces/tactics.interface.js";

import { fromFieldZoneObject } from "@/utils/field-zone.utils.js";
import { fromFormationObject } from "@/utils/formation.utils.js";

export function fromTacticsObject({ initialFormation, fieldZones = [], formations = [] }: TacticsObject): Tactics {
	return new Tactics(
		fromFormationObject(initialFormation),
		fieldZones.map((o) => fromFieldZoneObject(o)),
		formations.map((o) => fromFormationObject(o)),
	);
}

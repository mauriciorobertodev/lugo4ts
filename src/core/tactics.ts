import { ITactics, TacticsObject } from "@/interfaces/tactics.js";

import { Ball } from "@/core/ball.js";
import { FieldZone } from "@/core/field-zone.js";
import { Formation } from "@/core/formation.js";
import { Player } from "@/core/player.js";
import { Point } from "@/core/point.js";

export class Tactics<ZoneIdentifier extends string = string, FormationIdentifier extends string = string> implements ITactics {
	constructor(
		private initialFormation: Formation,
		private zones: FieldZone[] = [],
		private formations: Formation[] = [],
	) {}

	getFormations(): Formation[] {
		return this.formations;
	}

	setFormations(formations: Formation[]): this {
		this.formations = formations;
		return this;
	}

	addFormation(formation: Formation): this {
		this.formations.push(formation);
		return this;
	}

	getFormationById(id: FormationIdentifier): Formation | null {
		return this.formations.find((formation) => formation.getId() === id) ?? null;
	}

	getInitialFormation(): Formation {
		return this.initialFormation;
	}

	setInitialFormation(formation: Formation): this {
		this.initialFormation = formation;
		return this;
	}

	getFieldZones(): FieldZone[] {
		return this.zones;
	}

	setFieldZones(zones: FieldZone[]): this {
		this.zones = zones;
		return this;
	}

	addFieldZone(zone: FieldZone): this {
		this.zones.push(zone);
		return this;
	}

	getFieldZoneById(id: ZoneIdentifier): FieldZone | null {
		return this.zones.find((zone) => zone.getId() === id) ?? null;
	}

	getFormationByFieldZoneId(id: ZoneIdentifier): Formation | null {
		const zone = this.getFieldZoneById(id);
		return zone?.getFormation() ?? null;
	}

	getFormationByPoint(point: Point): Formation | null {
		const zone = this.zones.find((zone) => zone.containsPoint(point));
		return zone ? zone.getFormation() : null;
	}

	getFormationByBall(ball: Ball): Formation | null {
		const point = ball.getPosition();
		return this.getFormationByPoint(point);
	}

	getFormationByPlayer(player: Player): Formation | null {
		const point = player.getPosition();
		return this.getFormationByPoint(point);
	}

	clone(): Tactics<ZoneIdentifier> {
		return new Tactics(
			this.initialFormation.clone(),
			this.zones.map((zone) => zone.clone()),
		);
	}

	toObject(): TacticsObject {
		return {
			initialFormation: this.initialFormation.toObject(),
			fieldZones: this.zones.map((zone) => zone.toObject()),
			formations: this.formations.map((formation) => formation.toObject()),
		};
	}
}

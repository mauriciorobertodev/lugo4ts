import type { IBall } from "@/interfaces/ball.js";
import type { FieldZoneObject, IFieldZone } from "@/interfaces/field-zone.js";
import type { FormationObject, IFormation } from "@/interfaces/formation.js";
import type { IPlayer } from "@/interfaces/player.js";
import type { IPoint } from "@/interfaces/positionable.js";

export interface ITactics<ZoneIdentifier extends string = string, FormationIdentifier extends string = string> {
	getFormations(): IFormation[];
	setFormations(formations: IFormation[]): this;
	addFormation(formation: IFormation): this;
	getFormationById(id: FormationIdentifier): IFormation | null;

	getInitialFormation(): IFormation;
	setInitialFormation(formation: IFormation): this;

	getFieldZones(): IFieldZone[];
	setFieldZones(fieldZones: IFieldZone[]): this;
	addFieldZone(fieldZone: IFieldZone): this;

	getFieldZoneById(id: ZoneIdentifier): IFieldZone | null;

	getFormationByFieldZoneId(id: ZoneIdentifier): IFormation | null;
	getFormationByPoint(point: IPoint): IFormation | null;
	getFormationByBall(ball: IBall): IFormation | null;
	getFormationByPlayer(player: IPlayer): IFormation | null;

	clone(): ITactics<ZoneIdentifier>;

	toObject(): TacticsObject;
}

export type TacticsObject = {
	initialFormation: FormationObject;
	fieldZones: FieldZoneObject[];
	formations: FormationObject[];
};

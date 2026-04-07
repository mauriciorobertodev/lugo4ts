import type { FormationObject, IFormation } from "@/interfaces/formation.interface.js";
import type { IPlayer } from "@/interfaces/player.interface.js";
import type { IPoint } from "@/interfaces/positionable.interface.js";
import type { IRegion } from "@/interfaces/region.interface.js";

export interface IFieldZone {
	getId(): string;
	setId(id: string): this;
	getName(): string;
	setName(name: string): this;
	getStartCol(): number;
	getEndCol(): number;
	getStartRow(): number;
	getEndRow(): number;
	containsRegion(region: IRegion): boolean;
	containsPoint(point: IPoint): boolean;
	containsPlayer(player: IPlayer): boolean;
	getFormation(): IFormation;
	setFormation(formation: IFormation): this;

	clone(): IFieldZone;
	toObject(): FieldZoneObject;
	toJsonString(): string;
}

export type FieldZoneObject = {
	id?: string;
	name?: string;
	start: { col: number; row: number };
	end: { col: number; row: number };
	formation: FormationObject;
};

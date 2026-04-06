import type { FormationObject, IFormation } from "@/interfaces/formation.js";
import type { IPlayer } from "@/interfaces/player.js";
import type { IPoint } from "@/interfaces/positionable.js";
import type { IRegion } from "@/interfaces/region.js";

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

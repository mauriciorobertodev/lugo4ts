import { FormationObject, IFormation } from "@/interfaces/formation.js";
import { MapperObject } from "@/interfaces/mapper.js";
import { IPlayer, PlayerNumber } from "@/interfaces/player.js";
import { IPoint } from "@/interfaces/positionable.js";
import { IRegion } from "@/interfaces/region.js";

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

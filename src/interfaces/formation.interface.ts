import type { Side } from "@/core/side.js";
import type { IMapper, MapperObject } from "@/interfaces/mapper.interface.js";
import type { IPoint } from "@/interfaces/positionable.interface.js";

export interface IFormation {
	getId(): string;
	setId(id: string): this;

	getName(): string;
	setName(name: string): this;

	getType(): FormationType;
	setType(type: FormationType): this;

	getMapper(): IMapper | null;
	setMapper(mapper: IMapper): this;

	getViewSide(): Side;
	setViewSide(side: Side): this;

	hasPositionOf(playerNumber: number): boolean;

	getPositionOf(playerNumber: number): IPoint;
	tryGetPositionOf(playerNumber: number): IPoint | null;
	setPositionOf(playerNumber: number, position: IPoint): this;
	definePositionOf(playerNumber: number, x: number, y: number): this;

	countPositions(): number;
	getPositions(): Record<number, IPoint>;

	toArray(): IPoint[];

	clone(): IFormation;
	toObject(): FormationObject;
	toJsonString(): string;
}

export type FormationObject = {
	id?: string;
	name?: string;
	positions: Record<number, [number, number]>;
	type: FormationType;
	mapper?: MapperObject;
};

export enum FormationType {
	REGIONS = "regions",
	POINTS = "points",
}

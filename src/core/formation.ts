import { FormationObject, FormationType, IFormation } from "@/interfaces/formation.js";

import { Mapper } from "@/core/mapper.js";
import { Point } from "@/core/point.js";
import { Side } from "@/core/side.js";

import { randomUUID } from "@/utils/random.js";

import { ErrFormationMapperNotDefined, ErrFormationPlayerPositionNotDefined } from "@/errors.js";

export type FormationPositions = Record<number, Point>;

export class Formation implements IFormation {
	private side: Side = Side.HOME;

	constructor(
		private positions: FormationPositions = {},
		private name: string = "??????",
		private type: FormationType = FormationType.POINTS,
		private mapper: Mapper | null = null,
		private id: string = randomUUID(),
	) {
		if (this.mapper) {
			this.side = this.mapper.getViewSide();
			this.type = FormationType.REGIONS;
		}

		if (!this.name) this.name = randomUUID();
	}

	getId(): string {
		return this.id;
	}

	setId(id: string): this {
		this.id = id;
		return this;
	}

	getViewSide(): Side {
		return this.side;
	}

	hasPositionOf(playerNumber: number): boolean {
		return this.positions.hasOwnProperty(playerNumber);
	}

	getName(): string {
		return this.name;
	}

	setName(name: string): this {
		this.name = name;
		return this;
	}

	setMapper(mapper: Mapper): this {
		this.mapper = mapper;
		this.side = mapper.getViewSide();
		this.type = FormationType.REGIONS;
		return this;
	}

	getType(): FormationType {
		return this.type;
	}

	setType(type: FormationType): this {
		this.type = type;
		return this;
	}

	setViewSide(side: Side): this {
		this.side = side;
		if (this.mapper) this.mapper.setViewSide(side);
		return this;
	}

	getPositionOf(playerNumber: number): Point {
		const position = this.positions[playerNumber];
		if (!position) throw new ErrFormationPlayerPositionNotDefined(playerNumber);

		if (this.type === FormationType.REGIONS) {
			return this.getMapper().getRegion(position.getX(), position.getY()).getCenter();
		}

		return this.side === Side.AWAY ? Mapper.mirrorCoordsToAway(position) : position;
	}

	tryGetPositionOf(playerNumber: number): Point | null {
		const position = this.positions[playerNumber];
		if (!position) return null;

		if (this.type === FormationType.REGIONS) {
			return this.getMapper().getRegion(position.getX(), position.getY()).getCenter();
		}

		return this.side === Side.AWAY ? Mapper.mirrorCoordsToAway(position) : position;
	}

	setPositionOf(playerNumber: number, position: Point): this {
		this.positions[playerNumber] = position;
		return this;
	}

	definePositionOf(playerNumber: number, x: number, y: number): this {
		this.positions[playerNumber] = new Point(x, y);
		return this;
	}

	toArray(): Point[] {
		return Object.values(this.positions);
	}

	isRegions(): boolean {
		return this.type === FormationType.REGIONS;
	}

	getMapper(): Mapper {
		if (!this.mapper) throw new ErrFormationMapperNotDefined();
		return this.mapper;
	}

	getPositions(): Record<number, Point> {
		return this.positions;
	}

	countPositions(): number {
		return Object.keys(this.positions).length;
	}

	clone(): Formation {
		const clonedPositions: FormationPositions = {};
		for (const [key, value] of Object.entries(this.positions)) {
			clonedPositions[Number(key)] = value.clone();
		}
		return new Formation(clonedPositions, this.name, this.type, this.mapper ? this.mapper.clone() : null, randomUUID());
	}

	toObject(): FormationObject {
		const positions: Record<number, [number, number]> = {};
		for (const [playerNumber, point] of Object.entries(this.getPositions())) {
			positions[parseInt(playerNumber, 10)] = [point.getX(), point.getY()];
		}

		return {
			id: this.id,
			name: this.name,
			type: this.type,
			positions,
			mapper: this.mapper?.toObject(),
		};
	}

	toJsonString(): string {
		return JSON.stringify(this.toObject(), null, 4);
	}
}

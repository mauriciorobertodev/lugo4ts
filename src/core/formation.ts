import { IFormation } from '@/interfaces/formation.js';
import { IMapper } from '@/interfaces/mapper.js';
import { IPoint } from '@/interfaces/positionable.js';

import { Mapper } from '@/core/mapper.js';
import { Point } from '@/core/point.js';
import { Side } from '@/core/side.js';

import { ErrFormationMapperNotDefined, ErrFormationPlayerPositionNotDefined } from '@/errors.js';

type Positions = Record<number, IPoint>;

export class Formation implements IFormation {
    constructor(
        private positions: Positions = {},
        private name: string = '',
        private side: Side = Side.HOME,
        private type: FormationType = FormationType.POINTS,
        private mapper: IMapper | null = null
    ) {}

    getSide(): Side {
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

    setMapper(mapper: IMapper): this {
        this.mapper = mapper;
        this.side = mapper.getSide();
        return this;
    }

    getType(): FormationType {
        return this.type;
    }

    setType(type: FormationType): this {
        this.type = type;
        return this;
    }

    setSide(side: Side): this {
        this.side = side;
        if (this.mapper) this.mapper.setSide(side);
        return this;
    }

    getPositionOf(playerNumber: number): IPoint {
        const position = this.tryGetPositionOf(playerNumber);
        if (!position) throw new ErrFormationPlayerPositionNotDefined(playerNumber);
        return this.side === Side.AWAY ? Mapper.mirrorCoordsToAway(position) : position;
    }

    tryGetPositionOf(playerNumber: number): IPoint | null {
        const position = this.positions[playerNumber];
        if (!position) return null;

        if (this.type === FormationType.REGIONS) {
            return this.getMapper().getRegion(position.getX(), position.getY()).getCenter();
        }

        return this.side === Side.AWAY ? Mapper.mirrorCoordsToAway(position) : position;
    }

    setPositionOf(playerNumber: number, position: IPoint): this {
        this.positions[playerNumber] = position;
        return this;
    }

    definePositionOf(playerNumber: number, x: number, y: number): this {
        this.positions[playerNumber] = new Point(x, y);
        return this;
    }

    toArray(): IPoint[] {
        return Object.values(this.positions);
    }

    isRegions(): boolean {
        return this.type === FormationType.REGIONS;
    }

    getMapper(): IMapper {
        if (!this.mapper) throw new ErrFormationMapperNotDefined();
        return this.mapper;
    }

    getPositions(): Record<number, IPoint> {
        return this.positions;
    }

    countPositions(): number {
        return Object.keys(this.positions).length;
    }
}

export enum FormationType {
    REGIONS = 'regions',
    POINTS = 'points',
}

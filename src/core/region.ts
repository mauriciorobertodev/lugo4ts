import { IRegion, RegionObject } from '@/interfaces/region.js';

import { Mapper } from '@/core/mapper.js';
import { Player } from '@/core/player.js';
import { Point } from '@/core/point.js';
import { Side } from '@/core/side.js';

export class Region implements IRegion {
    constructor(
        protected col: number,
        protected row: number,
        protected side: Side,
        protected center: Point,
        protected mapper: Mapper
    ) {}

    getSide(): Side {
        return this.side;
    }

    is(region: IRegion): boolean {
        return this.eq(region);
    }

    eq(region: IRegion): boolean {
        return region.getCol() === this.col && region.getRow() === this.row;
    }

    getCol(): number {
        return this.col;
    }

    getRow(): number {
        return this.row;
    }

    getCenter(): Point {
        return this.center;
    }

    frontRight(): Region {
        return this.front().right();
    }

    front(): Region {
        return this.mapper.getRegion(Math.min(this.col + 1, this.mapper.getCols()), this.row);
    }

    frontLeft(): Region {
        return this.front().left();
    }

    backRight(): Region {
        return this.back().right();
    }

    back(): Region {
        return this.mapper.getRegion(Math.max(this.col - 1, 0), this.row);
    }

    backLeft(): Region {
        return this.back().left();
    }

    left(): Region {
        return this.mapper.getRegion(this.col, Math.max(this.row - 1, 0));
    }

    right(): Region {
        return this.mapper.getRegion(this.col, Math.min(this.row + 1, this.mapper.getRows()));
    }

    coordinates(): Point {
        return new Point(this.col, this.row);
    }

    distanceToRegion(region: Region): number {
        return this.coordinates().distanceTo(region.coordinates());
    }

    distanceToPoint(point: Point): number {
        return this.getCenter().distanceTo(point);
    }

    containsPoint(point: Point): boolean {
        return this.mapper.getRegionFromPoint(point).is(this);
    }

    containsPlayer(player: Player): boolean {
        return this.containsPoint(player.getPosition());
    }

    toString(): string {
        return `[${this.col}, ${this.row}]`;
    }

    clone(): Region {
        return new Region(this.col, this.row, this.side, this.center.clone(), this.mapper.clone());
    }

    toObject(): RegionObject {
        return {
            col: this.col,
            row: this.row,
            side: this.side,
            center: this.center.toObject(),
            mapper: this.mapper.toObject(),
        };
    }
}

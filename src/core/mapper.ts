import type { IMapper } from '../interfaces/mapper.ts';

import {
    ErrMapperColOutOfMapped,
    ErrMapperColsOutOfRange,
    ErrMapperRowOutOfMapped,
    ErrMapperRowsOutOfRange,
} from './errors.js';
import { Point } from './point.js';
import { Region } from './region.js';
import { Side } from './side.js';
import { SPECS } from './specs.js';

export class Mapper implements IMapper {
    private regionWidth: number;
    private regionHeight: number;

    constructor(
        private cols: number,
        private rows: number,
        private side: Side
    ) {
        if (cols < 4) {
            throw new ErrMapperColsOutOfRange(cols, 4, 200);
        }
        if (cols > 200) {
            throw new ErrMapperColsOutOfRange(cols, 4, 200);
        }
        if (rows < 2) {
            throw new ErrMapperRowsOutOfRange(rows, 2, 100);
        }
        if (rows > 100) {
            throw new ErrMapperRowsOutOfRange(rows, 2, 100);
        }

        this.regionWidth = SPECS.MAX_X_COORDINATE / cols;
        this.regionHeight = SPECS.MAX_Y_COORDINATE / rows;
    }

    getCols(): number {
        return this.cols;
    }

    setCols(cols: number): this {
        this.cols = cols;
        this.regionWidth = SPECS.MAX_X_COORDINATE / cols;
        return this;
    }

    getRows(): number {
        return this.rows;
    }

    setRows(rows: number): this {
        this.rows = rows;
        this.regionHeight = SPECS.MAX_Y_COORDINATE / rows;
        return this;
    }

    getSide(): Side {
        return this.side;
    }

    getRegion(col: number, row: number): Region {
        if (col < 0 || col >= this.cols) {
            throw new ErrMapperColOutOfMapped(col, 0, this.cols - 1);
        }

        if (row < 0 || row >= this.rows) {
            throw new ErrMapperRowOutOfMapped(row, 0, this.rows - 1);
        }

        col = Math.max(0, Math.min(this.cols - 1, col));
        row = Math.max(0, Math.min(this.rows - 1, row));

        let center = new Point();
        center.setX(Math.round(col * this.regionWidth + this.regionWidth / 2));
        center.setY(Math.round(row * this.regionHeight + this.regionHeight / 2));

        if (this.side === Side.AWAY) {
            center = this.mirrorCoordsToAway(center);
        }

        return new Region(col, row, this.side, center, this);
    }

    getRegionWidth(): number {
        return this.regionWidth;
    }

    getRegionHeight(): number {
        return this.regionHeight;
    }

    getRegionFromPoint(point: Point): Region {
        let pt = point;
        if (this.side === Side.AWAY) {
            pt = this.mirrorCoordsToAway(pt);
        }

        const cx = Math.floor(pt.getX() / this.regionWidth);
        const cy = Math.floor(pt.getY() / this.regionHeight);

        const col = Math.min(cx, this.cols - 1);
        const row = Math.min(cy, this.rows - 1);

        return this.getRegion(col, row);
    }

    getRandomRegion(): Region {
        const randomCol = Math.floor(Math.random() * this.cols);
        const randomRow = Math.floor(Math.random() * this.rows);
        return this.getRegion(randomCol, randomRow);
    }

    private mirrorCoordsToAway(center: Point): Point {
        const mirrored = new Point();
        mirrored.setX(SPECS.MAX_X_COORDINATE - center.getX());
        mirrored.setY(SPECS.MAX_Y_COORDINATE - center.getY());
        return mirrored;
    }
}

import type { Side } from '../core/side.ts';
import type { IPoint } from './positionable.js';
import type { IRegion } from './region.js';

export interface IMapper {
    getCols(): number;
    setCols(cols: number): this;

    getRows(): number;
    setRows(rows: number): this;

    getRegionWidth(): number;
    getRegionHeight(): number;

    getSide(): Side;

    getRegion(col: number, row: number): IRegion;
    getRegionFromPoint(point: IPoint): IRegion;
    getRandomRegion(): IRegion;
}

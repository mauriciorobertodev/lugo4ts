import type { Side } from '../side.ts';
import type { IPoint } from './positionable.d.ts';
import type { IRegion } from './region.d.ts';

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

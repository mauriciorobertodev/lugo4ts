import type { IPoint } from '@/interfaces/positionable.js';
import type { IRegion } from '@/interfaces/region.js';

import type { Side } from '@/core/side.js';

export interface IMapper {
    getCols(): number;
    setCols(cols: number): this;

    getRows(): number;
    setRows(rows: number): this;

    getRegionWidth(): number;
    getRegionHeight(): number;

    getSide(): Side;
    setSide(side: Side): this;

    getRegion(col: number, row: number): IRegion;
    getRegionFromPoint(point: IPoint): IRegion;
    getRandomRegion(): IRegion;

    isValidCol(col: number): boolean;
    isValidRow(row: number): boolean;
    isValidRegion(col: number, row: number): boolean;

    clone(): IMapper;
    toObject(): MapperObject;
}

export type MapperObject = {
    cols: number;
    rows: number;
    side: Side;
};

import type { IPoint, IRegion } from '@/interfaces.js';

import type { Side } from '@/core.js';

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
}

export type MapperObject = {
    cols: number;
    rows: number;
    side: Side;
};

import type { IMapper, IPoint, MapperObject } from '@/interfaces.js';

import type { FormationType, Side } from '@/core.js';

export interface IFormation {
    getName(): string;
    setName(name: string): this;

    getType(): FormationType;
    setType(type: FormationType): this;

    getMapper(): IMapper | null;
    setMapper(mapper: IMapper): this;

    getSide(): Side;
    setSide(side: Side): this;

    hasPositionOf(playerNumber: number): boolean;

    getPositionOf(playerNumber: number): IPoint;
    tryGetPositionOf(playerNumber: number): IPoint | null;
    setPositionOf(playerNumber: number, position: IPoint): this;
    definePositionOf(playerNumber: number, x: number, y: number): this;

    countPositions(): number;
    getPositions(): Record<number, IPoint>;

    toArray(): IPoint[];
}

export type FormationObject = {
    name?: string;
    side?: Side;
    positions?: Record<number, [number, number]>;
    type?: FormationType;
    mapper?: MapperObject | null;
};

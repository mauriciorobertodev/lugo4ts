import type { FormationType } from '../core/formation.ts';
import type { IPoint } from './positionable.js';

export interface IFormation {
    getName(): string;
    setName(name: string): this;

    getPositionOf(playerNumber: number): IPoint;
    setPositionOf(playerNumber: number, position: IPoint): this;
    definePositionOf(playerNumber: number, x: number, y: number): this;

    getPositionOf01(): IPoint;
    setPositionOf01(position: IPoint): this;
    definePositionOf01(x: number, y: number): this;

    getPositionOf02(): IPoint;
    setPositionOf02(position: IPoint): this;
    definePositionOf02(x: number, y: number): this;

    getPositionOf03(): IPoint;
    setPositionOf03(position: IPoint): this;
    definePositionOf03(x: number, y: number): this;

    getPositionOf04(): IPoint;
    setPositionOf04(position: IPoint): this;
    definePositionOf04(x: number, y: number): this;

    getPositionOf05(): IPoint;
    setPositionOf05(position: IPoint): this;
    definePositionOf05(x: number, y: number): this;

    getPositionOf06(): IPoint;
    setPositionOf06(position: IPoint): this;
    definePositionOf06(x: number, y: number): this;

    getPositionOf07(): IPoint;
    setPositionOf07(position: IPoint): this;
    definePositionOf07(x: number, y: number): this;

    getPositionOf08(): IPoint;
    setPositionOf08(position: IPoint): this;
    definePositionOf08(x: number, y: number): this;

    getPositionOf09(): IPoint;
    setPositionOf09(position: IPoint): this;
    definePositionOf09(x: number, y: number): this;

    getPositionOf10(): IPoint;
    setPositionOf10(position: IPoint): this;
    definePositionOf10(x: number, y: number): this;

    getPositionOf11(): IPoint;
    setPositionOf11(position: IPoint): this;
    definePositionOf11(x: number, y: number): this;

    toObject(): Record<number, IPoint>;
    toArray(): IPoint[];

    // static methods in TS interfaces can be modeled as static members in classes,
    // so here just define their signatures for reference.
    // For real static methods, implement them in a class.
    // Example:
    // static createZeroed(): IFormation;
    // static createFromArray(array: any[]): IFormation;
}

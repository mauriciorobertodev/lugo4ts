import type { IFormation } from '../interfaces/formation.js';
import { IPoint } from '../interfaces/positionable.js';

import { ErrFormationInvalidKey, ErrFormationInvalidPosition, ErrFormationPlayerPositionNotDefined } from './errors.js';
import { Point } from './point.js';
import { SPECS } from './specs.js';

export class Formation implements IFormation {
    private positions: Record<number, Point>;
    private name: string;
    private type?: FormationType;

    constructor(positions: Record<number, Point>, name = '', type?: FormationType) {
        this.positions = positions;
        this.name = name || Math.random().toString(36).substring(2, 10);
        this.type = type;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): this {
        this.name = name;
        return this;
    }

    getType(): FormationType {
        return this.type ?? FormationType.NOT_DEFINED;
    }

    setType(type: FormationType): this {
        this.type = type;
        return this;
    }

    getPositionOf(playerNumber: number): Point {
        const position = this.positions[playerNumber];
        if (!position) {
            throw new ErrFormationPlayerPositionNotDefined(playerNumber);
        }
        return position;
    }

    setPositionOf(playerNumber: number, position: Point): this {
        this.positions[playerNumber] = position;
        return this;
    }

    definePositionOf(playerNumber: number, x: number, y: number): this {
        this.positions[playerNumber] = new Point(x, y);
        return this;
    }

    toObject(): Record<number, IPoint> {
        return this.positions;
    }

    toArray(): Point[] {
        return Object.values(this.positions);
    }

    static createZeroed(): Formation {
        const positions: Record<number, Point> = {};
        for (let i = 1; i <= SPECS.MAX_PLAYERS; i++) {
            positions[i] = new Point();
        }
        return new Formation(positions);
    }

    static createFromArray(data: Record<number, [number, number]>): Formation {
        const formation = Formation.createZeroed();

        for (const [keyStr, value] of Object.entries(data)) {
            const key = parseInt(keyStr, 10);

            if (isNaN(key) || key < 1 || key > SPECS.MAX_PLAYERS) {
                throw new ErrFormationInvalidKey(keyStr);
            }

            if (!Array.isArray(value) || value.length < 2) {
                throw new ErrFormationInvalidPosition(key);
            }

            const [x, y] = value;

            if (typeof x !== 'number' || typeof y !== 'number') {
                throw new ErrFormationInvalidPosition(key);
            }

            formation.definePositionOf(key, x, y);
        }

        return formation;
    }

    // Métodos auxiliares opcionais — podem ser gerados dinamicamente se necessário
    getPositionOf01(): Point {
        return this.getPositionOf(1);
    }

    setPositionOf01(p: Point): this {
        return this.setPositionOf(1, p);
    }

    definePositionOf01(x: number, y: number): this {
        return this.definePositionOf(1, x, y);
    }

    getPositionOf02(): Point {
        return this.getPositionOf(2);
    }

    setPositionOf02(p: Point): this {
        return this.setPositionOf(2, p);
    }

    definePositionOf02(x: number, y: number): this {
        return this.definePositionOf(2, x, y);
    }

    getPositionOf03(): Point {
        return this.getPositionOf(3);
    }

    setPositionOf03(p: Point): this {
        return this.setPositionOf(3, p);
    }

    definePositionOf03(x: number, y: number): this {
        return this.definePositionOf(3, x, y);
    }

    getPositionOf04(): Point {
        return this.getPositionOf(4);
    }

    setPositionOf04(p: Point): this {
        return this.setPositionOf(4, p);
    }

    definePositionOf04(x: number, y: number): this {
        return this.definePositionOf(4, x, y);
    }

    getPositionOf05(): Point {
        return this.getPositionOf(5);
    }

    setPositionOf05(p: Point): this {
        return this.setPositionOf(5, p);
    }

    definePositionOf05(x: number, y: number): this {
        return this.definePositionOf(5, x, y);
    }

    getPositionOf06(): Point {
        return this.getPositionOf(6);
    }

    setPositionOf06(p: Point): this {
        return this.setPositionOf(6, p);
    }

    definePositionOf06(x: number, y: number): this {
        return this.definePositionOf(6, x, y);
    }

    getPositionOf07(): Point {
        return this.getPositionOf(7);
    }

    setPositionOf07(p: Point): this {
        return this.setPositionOf(7, p);
    }

    definePositionOf07(x: number, y: number): this {
        return this.definePositionOf(7, x, y);
    }

    getPositionOf08(): Point {
        return this.getPositionOf(8);
    }

    setPositionOf08(p: Point): this {
        return this.setPositionOf(8, p);
    }

    definePositionOf08(x: number, y: number): this {
        return this.definePositionOf(8, x, y);
    }

    getPositionOf09(): Point {
        return this.getPositionOf(9);
    }

    setPositionOf09(p: Point): this {
        return this.setPositionOf(9, p);
    }

    definePositionOf09(x: number, y: number): this {
        return this.definePositionOf(9, x, y);
    }

    getPositionOf10(): Point {
        return this.getPositionOf(10);
    }

    setPositionOf10(p: Point): this {
        return this.setPositionOf(10, p);
    }

    definePositionOf10(x: number, y: number): this {
        return this.definePositionOf(10, x, y);
    }

    getPositionOf11(): Point {
        return this.getPositionOf(11);
    }

    setPositionOf11(p: Point): this {
        return this.setPositionOf(11, p);
    }

    definePositionOf11(x: number, y: number): this {
        return this.definePositionOf(11, x, y);
    }
}

export enum FormationType {
    REGIONS = 'regions',
    POINTS = 'points',
    NOT_DEFINED = '',
}

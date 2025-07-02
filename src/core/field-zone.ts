import {
    Formation,
    Mapper,
    MapperObject,
    Player,
    PlayerNumber,
    Point,
    Region,
    makeFormation,
    randomUUID,
} from '@/index.js';

import { FieldZoneObject, IFieldZone } from '@/interfaces/field-zone.js';

export class FieldZone implements IFieldZone {
    constructor(
        private name: string,
        private startCol: number,
        private endCol: number,
        private startRow: number,
        private endRow: number,
        private formation: Formation,
        private id: string = randomUUID()
    ) {}

    setId(id: string): this {
        this.id = id;
        return this;
    }

    setName(name: string): this {
        this.name = name;
        return this;
    }

    getId(): string {
        return this.id;
    }

    getStartCol(): number {
        return this.startCol;
    }

    getEndCol(): number {
        return this.endCol;
    }

    getStartRow(): number {
        return this.startRow;
    }

    getEndRow(): number {
        return this.endRow;
    }

    containsRegion(region: Region): boolean {
        return (
            region.getCol() >= this.startCol &&
            region.getCol() <= this.endCol &&
            region.getRow() >= this.startRow &&
            region.getRow() <= this.endRow
        );
    }

    containsPoint(point: Point): boolean {
        const region = this.formation.getMapper().getRegionFromPoint(point);
        return this.containsRegion(region);
    }

    containsPlayer(player: Player): boolean {
        const region = this.formation.getMapper().getRegionFromPoint(player.getPosition());
        return this.containsRegion(region);
    }

    getFormation(): Formation {
        return this.formation;
    }

    setFormation(formation: Formation): this {
        this.formation = formation;
        return this;
    }

    getName(): string {
        return this.name;
    }

    clone(): FieldZone {
        return new FieldZone(
            this.name,
            this.startCol,
            this.endCol,
            this.startRow,
            this.endRow,
            this.formation.clone(),
            randomUUID()
        );
    }

    toObject(): FieldZoneObject {
        const positions: Record<number, [number, number]> = {};

        for (const [number, position] of Object.entries(this.formation.getPositions())) {
            positions[Number(number)] = [position.getX(), position.getY()];
        }

        return {
            id: this.getId(),
            name: this.getName(),
            start: { col: this.startCol, row: this.startRow },
            end: { col: this.endCol, row: this.endRow },
            formation: this.formation.toObject(),
        };
    }

    toJsonString(): string {
        return JSON.stringify(this.toObject(), null, 4);
    }
}

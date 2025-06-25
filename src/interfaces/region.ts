import type { IPlayer } from '@/interfaces/player.js';
import type { IPoint } from '@/interfaces/positionable.js';

export interface IRegion {
    eq(region: IRegion): boolean;
    is(region: IRegion): boolean;

    getCol(): number;
    getRow(): number;

    getCenter(): IPoint;
    frontRight(): IRegion;
    front(): IRegion;
    frontLeft(): IRegion;
    backRight(): IRegion;
    back(): IRegion;
    backLeft(): IRegion;
    left(): IRegion;
    right(): IRegion;

    coordinates(): IPoint;

    distanceToRegion(region: IRegion): number;
    distanceToPoint(point: IPoint): number;

    containsPlayer(player: IPlayer): boolean;
    containsPoint(point: IPoint): boolean;

    toString(): string;
}

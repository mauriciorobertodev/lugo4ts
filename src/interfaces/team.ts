import type { Side } from '../core/side.ts';
import type { IPlayer } from './player.js';

export interface ITeam {
    getPlayers(): IPlayer[];
    getName(): string;
    getScore(): number;
    getSide(): Side;
    hasPlayer(number: number): boolean;
}

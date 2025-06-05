import type { Side } from '../side.ts';
import type { IPlayer } from './player.d.ts';

export interface ITeam {
    getPlayers(): IPlayer[];
    getName(): string;
    getScore(): number;
    getSide(): Side;
    hasPlayer(number: number): boolean;
}

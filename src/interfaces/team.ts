import type { Side } from '../core/side.ts';
import type { IPlayer } from './player.js';

export interface ITeam {
    getPlayers(): IPlayer[];
    getName(): string;
    getScore(): number;
    getSide(): Side;
    hasPlayer(number: number): boolean;
    getPlayer(number: number): IPlayer;
    tryGetPlayer(number: number): IPlayer | null;
    getRandomPlayer(ignoreGoalkeeper: boolean): IPlayer;
    tryGetRandomPlayer(ignoreGoalkeeper: boolean): IPlayer | null;
    getGoalkeeper(): IPlayer;
    tryGetGoalkeeper(): IPlayer | null;
}

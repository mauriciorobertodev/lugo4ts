import type { IFormation } from '@/interfaces/formation.js';
import type { IPlayer, PlayerObject } from '@/interfaces/player.js';

import type { Side } from '@/core/side.js';

export interface ITeam {
    getPlayers(): IPlayer[];

    getName(): string;
    setName(name: string): this;

    getScore(): number;
    setScore(score: number): this;
    incrementScore(): this;
    decrementScore(): this;
    resetScore(): this;

    getSide(): Side;
    setSide(side: Side): this;

    getPlayersCount(): number;

    hasPlayer(number: number): boolean;
    getPlayer(number: number): IPlayer;
    tryGetPlayer(number: number): IPlayer | null;
    addPlayer(player: IPlayer): this;

    getRandomPlayer(ignore?: number[]): IPlayer;
    tryGetRandomPlayer(ignore?: number[]): IPlayer | null;

    getGoalkeeper(): IPlayer;
    tryGetGoalkeeper(): IPlayer | null;

    setPositionsByFormation(formation: IFormation): this;

    clone(): ITeam;
    toObject(): TeamObject;
}

export type TeamObject = {
    side: Side;
    name: string;
    score: number;
    players: PlayerObject[];
};

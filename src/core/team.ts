import { IPlayer } from '../interfaces/player.js';
import type { ITeam } from '../interfaces/team.ts';

import { ErrPlayerNotFound } from './errors.js';
import { Player } from './player.js';
import { Side } from './side.js';
import { SPECS } from './specs.js';
import { Util } from './util.js';

export class Team implements ITeam {
    constructor(
        private name: string,
        private score: number,
        private side: Side,
        private players: Player[]
    ) {}
    getRandomPlayer(ignoreGoalkeeper: boolean = true): Player {
        const players = this.players.filter((p) =>
            ignoreGoalkeeper ? p.getNumber() !== SPECS.GOALKEEPER_NUMBER : true
        );
        if (players.length === 0) throw new Error('No players available.');
        return Util.randomElement(players);
    }
    tryGetRandomPlayer(ignoreGoalkeeper: boolean = true): Player | null {
        try {
            return this.getRandomPlayer(ignoreGoalkeeper);
        } catch {
            return null;
        }
    }

    getGoalkeeper(): Player {
        const player = this.players.find((p) => p.getNumber() === SPECS.GOALKEEPER_NUMBER);
        if (!player) throw new Error('Goalkeeper not found.');
        return player;
    }

    tryGetGoalkeeper(): Player | null {
        try {
            return this.getGoalkeeper();
        } catch {
            return null;
        }
    }

    getPlayer(number: number): Player {
        const player = this.players.find((p) => p.getNumber() === number);
        if (!player) throw new ErrPlayerNotFound(this.side, number);
        return player;
    }

    tryGetPlayer(number: number): Player | null {
        return this.players.find((p) => p.getNumber() === number) ?? null;
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public getName(): string {
        return this.name;
    }

    public getScore(): number {
        return this.score;
    }

    public getSide(): Side {
        return this.side;
    }

    public hasPlayer(number: number): boolean {
        return this.players.some((player) => player.getNumber() === number);
    }
}

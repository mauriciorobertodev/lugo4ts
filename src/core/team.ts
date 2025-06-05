import type { ITeam } from '../interfaces/team.ts';

import { Player } from './player.js';
import { Side } from './side.js';

export class Team implements ITeam {
    constructor(
        private name: string,
        private score: number,
        private side: Side,
        private players: Player[]
    ) {}

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

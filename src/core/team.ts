import type { IFormation, IPlayer, ITeam } from '@/interfaces.js';

import { Formation, Player, SPECS, Side } from '@/core.js';

import { randomElement } from '@/utils.js';

import { ErrPlayerNotFound } from '@/errors.js';

export class Team implements ITeam {
    constructor(
        private name: string,
        private score: number,
        private side: Side,
        private players: IPlayer[]
    ) {}

    setName(name: string): this {
        this.name = name;
        return this;
    }

    incrementScore(): this {
        this.score += 1;
        return this;
    }

    decrementScore(): this {
        this.score -= 1;
        return this;
    }

    resetScore(): this {
        this.score = 0;
        return this;
    }

    setSide(side: Side): this {
        this.side = side;
        return this;
    }

    getPlayersCount(): number {
        return this.players.length;
    }

    setScore(score: number): this {
        if (score < 0) {
            throw new Error(`Score cannot be negative: ${score}`);
        }
        this.score = score;
        return this;
    }

    getRandomPlayer(ignore: number[] = []): IPlayer {
        const players = this.players.filter((p) => !ignore.includes(p.getNumber()));
        if (players.length === 0) throw new Error('No players available.');
        return randomElement(players);
    }

    tryGetRandomPlayer(ignore: number[] = []): IPlayer | null {
        try {
            return this.getRandomPlayer(ignore);
        } catch {
            return null;
        }
    }

    getGoalkeeper(): IPlayer {
        const player = this.players.find((p) => p.getNumber() === SPECS.GOALKEEPER_NUMBER);
        if (!player) throw new Error('Goalkeeper not found.');
        return player;
    }

    tryGetGoalkeeper(): IPlayer | null {
        try {
            return this.getGoalkeeper();
        } catch {
            return null;
        }
    }

    getPlayer(number: number): IPlayer {
        const player = this.players.find((p) => p.getNumber() === number);
        if (!player) throw new ErrPlayerNotFound(this.side, number);
        return player;
    }

    tryGetPlayer(number: number): IPlayer | null {
        return this.players.find((p) => p.getNumber() === number) ?? null;
    }

    getPlayers(): IPlayer[] {
        return this.players;
    }

    getName(): string {
        return this.name;
    }

    getScore(): number {
        return this.score;
    }

    getSide(): Side {
        return this.side;
    }

    hasPlayer(number: number): boolean {
        return this.players.some((player) => player.getNumber() === number);
    }

    setPositionsByFormation(formation: IFormation): this {
        formation.setSide(this.side);
        this.players.forEach((player, index) => {
            const position = formation.tryGetPositionOf(player.getNumber());
            if (position) player.setPosition(position);
        });
        return this;
    }

    setPlayer(player: Player): this {
        if (player.getTeamSide() !== this.side) {
            throw new Error(`Player side ${player.getTeamSide()} does not match team side ${this.side}`);
        }
        this.players = this.players.filter((p) => p.getNumber() !== player.getNumber());
        this.players.push(player);
        return this;
    }
}

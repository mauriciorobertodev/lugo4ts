import { ITeam, TeamObject } from '@/interfaces/team.js';

import { Formation } from '@/core/formation.js';
import { Player } from '@/core/player.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';

import { randomElement } from '@/utils/random.js';

import {
    ErrPlayerNotFound,
    ErrTeamDuplicatePlayer,
    ErrTeamEmpty,
    ErrTeamInvalidScore,
    ErrTeamInvalidSide,
} from '@/errors.js';

export class Team implements ITeam {
    constructor(
        private name: string,
        private score: number,
        private side: Side,
        private players: Player[]
    ) {
        if (this.score < 0) {
            throw new ErrTeamInvalidScore(this.score);
        }

        this.players.forEach((player) => {
            if (player.getTeamSide() !== this.side) {
                throw new ErrTeamInvalidSide(player.getNumber(), this.side);
            }
        });

        const takenNumbers = new Set<number>();
        for (const player of this.players) {
            if (takenNumbers.has(player.getNumber())) {
                throw new ErrTeamDuplicatePlayer(player.getNumber());
            }
            takenNumbers.add(player.getNumber());
        }
    }

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
            throw new ErrTeamInvalidScore(this.score);
        }
        this.score = score;
        return this;
    }

    getRandomPlayer(ignore: number[] = []): Player {
        const players = this.players.filter((p) => !ignore.includes(p.getNumber()));
        if (players.length === 0) throw new ErrTeamEmpty();
        return randomElement(players);
    }

    tryGetRandomPlayer(ignore: number[] = []): Player | null {
        try {
            return this.getRandomPlayer(ignore);
        } catch {
            return null;
        }
    }

    getGoalkeeper(): Player {
        return this.getPlayer(SPECS.GOALKEEPER_NUMBER);
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

    getPlayers(): Player[] {
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

    setPositionsByFormation(formation: Formation): this {
        formation.setSide(this.side);
        this.players.forEach((player, index) => {
            const position = formation.tryGetPositionOf(player.getNumber());
            if (position) player.setPosition(position);
        });
        return this;
    }

    addPlayer(player: Player): this {
        if (player.getTeamSide() !== this.side) {
            throw new ErrTeamInvalidSide(player.getNumber(), this.side);
        }
        this.players = this.players.filter((p) => p.getNumber() !== player.getNumber());
        this.players.push(player);
        return this;
    }

    clone(): Team {
        return new Team(
            this.name,
            this.score,
            this.side,
            this.players.map((player) => player.clone())
        );
    }

    toObject(): TeamObject {
        return {
            name: this.name,
            score: this.score,
            side: this.side,
            players: this.players.map((player) => player.toObject()),
        };
    }
}

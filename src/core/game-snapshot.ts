import { IBall } from '@/interfaces/ball.js';
import { IGameSnapshot, ServerState } from '@/interfaces/game-snapshot.js';
import { IPlayer } from '@/interfaces/player.js';
import { IPoint, IVector2D } from '@/interfaces/positionable.js';
import { IShotClock } from '@/interfaces/shot-clock.js';
import { ITeam } from '@/interfaces/team.js';
import { IVelocity } from '@/interfaces/velocity.js';

import { SPECS } from '@/core/specs.js';

export class GameSnapshot implements IGameSnapshot {
    constructor(
        private readonly serverState: ServerState,
        private readonly turn: number,
        private readonly homeTeam?: ITeam,
        private readonly awayTeam?: ITeam,
        private readonly ball?: IBall,
        private readonly turnsBallInGoalZone?: number,
        private readonly shotClock?: IShotClock
    ) {}

    hasHomePlayer(number: number): boolean {
        return this.getHomePlayers().some((player) => player.getNumber() === number);
    }

    hasAwayPlayer(number: number): boolean {
        return this.getAwayPlayers().some((player) => player.getNumber() === number);
    }

    getHomePlayer(number: number): IPlayer | null {
        return this.getHomePlayers().find((player) => player.getNumber() === number) || null;
    }

    getHomeGoalkeeper(): IPlayer | null {
        return this.getHomePlayer(SPECS.GOALKEEPER_NUMBER);
    }

    getHomePlayers(): IPlayer[] {
        return this.homeTeam?.getPlayers() || [];
    }

    getAwayPlayer(number: number): IPlayer | null {
        return this.getAwayPlayers().find((player) => player.getNumber() === number) || null;
    }

    getAwayGoalkeeper(): IPlayer | null {
        return this.getAwayPlayer(SPECS.GOALKEEPER_NUMBER);
    }

    getAwayPlayers(): IPlayer[] {
        return this.awayTeam?.getPlayers() || [];
    }

    hasBallHolder(): boolean {
        return this.getBallHolder() !== null;
    }

    hasShotClock(): boolean {
        return this.shotClock !== undefined;
    }

    getBallPosition(): IPoint {
        return this.getBall().getPosition();
    }

    getBallSpeed(): number {
        return this.getBall().getSpeed();
    }

    getBallDirection(): IVector2D {
        return this.getBall().getDirection();
    }

    getBallVelocity(): IVelocity {
        return this.getBall().getVelocity();
    }

    getBallHolder(): IPlayer | null {
        return this.getBall().getHolder();
    }

    getBallTurnsInGoalZone(): number {
        return this.turnsBallInGoalZone || 0;
    }

    getBallRemainingTurnsInGoalZone(): number {
        return SPECS.BALL_TIME_IN_GOAL_ZONE - this.getBallTurnsInGoalZone();
    }

    getShotClock(): IShotClock | null {
        return this.shotClock || null;
    }

    getTurn(): number {
        return this.turn;
    }

    getState(): ServerState {
        return this.serverState;
    }

    getHomeTeam(): ITeam {
        return this.homeTeam!;
    }

    getAwayTeam(): ITeam {
        return this.awayTeam!;
    }

    getBall(): IBall {
        return this.ball!;
    }
}

import { GameSnapshotObject, IGameSnapshot, ServerState } from '@/interfaces/game-snapshot.js';

import { Ball } from '@/core/ball.js';
import { Player } from '@/core/player.js';
import { Point } from '@/core/point.js';
import { ShotClock } from '@/core/shot-clock.js';
import { SPECS } from '@/core/specs.js';
import { Team } from '@/core/team.js';
import { Vector2D } from '@/core/vector.js';
import { Velocity } from '@/core/velocity.js';

export class GameSnapshot implements IGameSnapshot {
    constructor(
        private readonly serverState: ServerState,
        private readonly turn: number,
        private readonly homeTeam?: Team,
        private readonly awayTeam?: Team,
        private readonly ball?: Ball,
        private readonly ballTurnsInGoalZone?: number,
        private readonly shotClock?: ShotClock
    ) {}

    hasHomePlayer(number: number): boolean {
        return this.getHomePlayers().some((player) => player.getNumber() === number);
    }

    hasAwayPlayer(number: number): boolean {
        return this.getAwayPlayers().some((player) => player.getNumber() === number);
    }

    getHomePlayer(number: number): Player | null {
        return this.getHomePlayers().find((player) => player.getNumber() === number) || null;
    }

    getHomeGoalkeeper(): Player | null {
        return this.getHomePlayer(SPECS.GOALKEEPER_NUMBER);
    }

    getHomePlayers(): Player[] {
        return this.homeTeam?.getPlayers() || [];
    }

    getAwayPlayer(number: number): Player | null {
        return this.getAwayPlayers().find((player) => player.getNumber() === number) || null;
    }

    getAwayGoalkeeper(): Player | null {
        return this.getAwayPlayer(SPECS.GOALKEEPER_NUMBER);
    }

    getAwayPlayers(): Player[] {
        return this.awayTeam?.getPlayers() || [];
    }

    hasBallHolder(): boolean {
        return this.getBallHolder() !== null;
    }

    hasShotClock(): boolean {
        return this.shotClock !== undefined;
    }

    getBallPosition(): Point {
        return this.getBall().getPosition();
    }

    getBallSpeed(): number {
        return this.getBall().getSpeed();
    }

    getBallDirection(): Vector2D {
        return this.getBall().getDirection();
    }

    getBallVelocity(): Velocity {
        return this.getBall().getVelocity();
    }

    getBallHolder(): Player | null {
        return this.getBall().getHolder();
    }

    getBallTurnsInGoalZone(): number {
        return this.ballTurnsInGoalZone || 0;
    }

    getBallRemainingTurnsInGoalZone(): number {
        return SPECS.BALL_MAX_TURNS_IN_GOAL_ZONE - this.getBallTurnsInGoalZone();
    }

    getShotClock(): ShotClock | null {
        return this.shotClock || null;
    }

    getTurn(): number {
        return this.turn;
    }

    getState(): ServerState {
        return this.serverState;
    }

    getHomeTeam(): Team {
        return this.homeTeam!;
    }

    getAwayTeam(): Team {
        return this.awayTeam!;
    }

    getBall(): Ball {
        return this.ball!;
    }

    clone(): GameSnapshot {
        return new GameSnapshot(
            this.serverState,
            this.turn,
            this.homeTeam ? this.homeTeam.clone() : undefined,
            this.awayTeam ? this.awayTeam.clone() : undefined,
            this.ball ? this.ball.clone() : undefined,
            this.ballTurnsInGoalZone,
            this.shotClock ? this.shotClock.clone() : undefined
        );
    }

    toObject(): GameSnapshotObject {
        return {
            state: this.serverState,
            turn: this.turn,
            homeTeam: this.homeTeam?.toObject(),
            awayTeam: this.awayTeam?.toObject(),
            ball: this.ball?.toObject(),
            shotClock: this.shotClock?.toObject(),
            ballTurnsInGoalZone: this.ballTurnsInGoalZone || 0,
        };
    }
}

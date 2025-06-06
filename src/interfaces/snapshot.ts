import type { IBall } from './ball.js';
import type { IPlayer } from './player.js';
import type { IPoint, IVector2D } from './positionable.js';
import type { IShotClock } from './shot-clock.js';
import type { ITeam } from './team.js';
import type { IVelocity } from './velocity.js';

export enum ServerState {
    WAITING = 'WAITING',
    READY = 'READY',
    LISTENING = 'LISTENING',
    PLAYING = 'PLAYING',
    SHIFTING = 'SHIFTING',
    OVER = 'OVER',
}

export interface ISnapshot {
    getTurn(): number;
    getState(): ServerState;

    getHomeTeam(): ITeam;
    getHomePlayer(number: number): IPlayer | null;
    getHomeGoalkeeper(): IPlayer | null;
    getHomePlayers(): IPlayer[];

    getAwayTeam(): ITeam;
    getAwayPlayer(number: number): IPlayer | null;
    getAwayGoalkeeper(): IPlayer | null;
    getAwayPlayers(): IPlayer[];

    hasBallHolder(): boolean;
    hasShotClock(): boolean;
    hasHomePlayer(number: number): boolean;
    hasAwayPlayer(number: number): boolean;

    getBall(): IBall;
    getBallPosition(): IPoint;
    getBallSpeed(): number;
    getBallDirection(): IVector2D;
    getBallVelocity(): IVelocity;
    getBallHolder(): IPlayer | null;
    getBallTurnsInGoalZone(): number;
    getBallRemainingTurnsInGoalZone(): number;

    getShotClock(): IShotClock | null;
}

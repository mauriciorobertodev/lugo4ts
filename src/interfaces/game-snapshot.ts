import type { BallObject, IBall } from '@/interfaces/ball.js';
import type { IPlayer } from '@/interfaces/player.js';
import type { IPoint, IVector2D } from '@/interfaces/positionable.js';
import type { IShotClock, ShotClockObject } from '@/interfaces/shot-clock.js';
import type { ITeam, TeamObject } from '@/interfaces/team.js';
import type { IVelocity } from '@/interfaces/velocity.js';

export enum ServerState {
    WAITING = 'WAITING',
    READY = 'READY',
    LISTENING = 'LISTENING',
    PLAYING = 'PLAYING',
    SHIFTING = 'SHIFTING',
    OVER = 'OVER',
}

export interface IGameSnapshot {
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

    clone(): IGameSnapshot;
    toObject(): GameSnapshotObject;
}

export type GameSnapshotObject = {
    turn: number;
    state: ServerState;
    homeTeam?: TeamObject;
    awayTeam?: TeamObject;
    ball?: BallObject;
    shotClock?: ShotClockObject | null;
    ballTurnsInGoalZone: number;
};

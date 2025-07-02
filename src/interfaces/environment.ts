import { BallObject, IBall } from '@/interfaces/ball.js';
import { IFormation } from '@/interfaces/formation.js';
import { IPlayer } from '@/interfaces/player.js';
import { IPoint, IVector2D } from '@/interfaces/positionable.js';
import { IShotClock, ShotClockObject } from '@/interfaces/shot-clock.js';
import { ITeam, TeamObject } from '@/interfaces/team.js';
import { IVelocity } from '@/interfaces/velocity.js';

import { Side } from '@/core/side.js';

export interface IEnvironment {
    getName(): string;
    setName(name: string): this;

    getTurn(): number | null;
    setTurn(turn: number): this;

    getBall(): IBall | null;
    setBall(ball: IBall): this;
    setBallPosition(position: IPoint): this;
    setBallVelocity(velocity: IVelocity): this;
    setBallDirection(direction: IVector2D): this;
    setBallSpeed(speed: number): this;
    setBallHolder(player: IPlayer | null): this;

    addPlayer(player: IPlayer): this;

    getHomeTeam(): ITeam | null;
    setHomeTeam(team: ITeam): this;
    setHomeScore(score: number): this;
    getHomePlayer(number: number): IPlayer;
    tryGetHomePlayer(number: number): IPlayer | null;
    setHomeTeamPositionsByFormation(formation: IFormation): this;
    getHomePlayers(): IPlayer[];

    getAwayTeam(): ITeam | null;
    setAwayTeam(team: ITeam): this;
    setAwayScore(score: number): this;
    getAwayPlayer(number: number): IPlayer;
    tryGetAwayPlayer(number: number): IPlayer | null;
    setAwayTeamPositionsByFormation(formation: IFormation): this;
    getAwayPlayers(): IPlayer[];

    tryGetPlayerByNumberAndSide(number: number, side: Side): IPlayer | null;

    getShotClock(): IShotClock | null;
    setShotClock(shotClock: IShotClock): this;

    toObject(): EnvironmentObject;
    toJsonString(): string;
}

export type EnvironmentObject = {
    name?: string;
    turn?: number;
    ball?: BallObject;
    homeTeam?: TeamObject;
    awayTeam?: TeamObject;
    shotClock?: ShotClockObject;
};

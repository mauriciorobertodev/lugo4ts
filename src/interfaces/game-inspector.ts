import type { Order } from '@/generated/server.js';

import type { IBall } from '@/interfaces/ball.js';
import type { IGoal } from '@/interfaces/goal.js';
import type { IPlayer } from '@/interfaces/player.js';
import type { IPoint, IVector2D } from '@/interfaces/positionable.js';
import type { IRegion } from '@/interfaces/region.js';
import type { IShotClock } from '@/interfaces/shot-clock.js';
import type { ITeam } from '@/interfaces/team.js';
import type { IVelocity } from '@/interfaces/velocity.js';

import type { PlayerState } from '@/core/player.js';
import type { Side } from '@/core/side.js';

export interface IGameInspector {
    getTurn(): number;
    getPlayer(side: Side, number: number): IPlayer;
    tryGetPlayer(side: Side, number: number): IPlayer | null;
    getTeam(side: Side): ITeam;

    hasShotClock(): boolean;
    getShotClock(): IShotClock | null;

    getBall(): IBall;
    getBallHolder(): IPlayer | null;
    getBallHasHolder(): boolean;
    getBallTurnsInGoalZone(): number;
    getBallRemainingTurnsInGoalZone(): number;
    getBallPosition(): IPoint;
    getBallDirection(): IVector2D;
    getBallSpeed(): number;

    getAttackGoal(): IGoal;
    getDefenseGoal(): IGoal;

    getMe(): IPlayer;
    getMyState(): PlayerState;
    getMyTeam(): ITeam;
    getMyNumber(): number;
    getMyTeamSide(): Side;
    getMyPosition(): IPoint;
    getMyDirection(): IVector2D;
    getMySpeed(): number;
    getMyVelocity(): IVelocity;
    getMyPlayers(): IPlayer[];
    getMyGoalkeeper(): IPlayer;
    tryGetMyGoalkeeper(): IPlayer | null;
    getMyScore(): number;
    getMyPlayer(number: number): IPlayer;
    tryGetMyPlayer(number: number): IPlayer | null;

    getOpponentPlayer(number: number): IPlayer;
    tryGetOpponentPlayer(number: number): IPlayer | null;
    getOpponentTeam(): ITeam;
    getOpponentSide(): Side;
    getOpponentPlayers(): IPlayer[];
    getOpponentGoalkeeper(): IPlayer;
    tryGetOpponentGoalkeeper(): IPlayer | null;
    getOpponentScore(): number;

    makeOrderMoveToPoint(point: IPoint, speed?: number): Order;
    makeOrderKickToPoint(target: IPoint, speed?: number): Order;

    makeOrderMoveToDirection(direction: IVector2D, speed?: number): Order;
    makeOrderKickToDirection(direction: IVector2D, speed?: number): Order;

    makeOrderMoveToRegion(region: IRegion, speed?: number): Order;
    makeOrderKickToRegion(region: IRegion, speed?: number): Order;

    makeOrderMoveToPlayer(player: IPlayer, speed?: number): Order;
    makeOrderKickToPlayer(player: IPlayer, speed?: number): Order;

    makeOrderLookAtPoint(point: IPoint): Order;
    makeOrderLookAtDirection(direction: IVector2D): Order;

    makeOrderJumpToPoint(target: IPoint, speed?: number): Order;

    tryMakeOrderMoveToPoint(point: IPoint, speed?: number): Order | null;
    tryMakeOrderKickToPoint(target: IPoint, speed?: number): Order | null;

    tryMakeOrderMoveToDirection(direction: IVector2D, speed?: number): Order | null;
    tryMakeOrderKickToDirection(direction: IVector2D, speed?: number): Order | null;

    tryMakeOrderMoveToRegion(region: IRegion, speed?: number): Order | null;
    tryMakeOrderKickToRegion(region: IRegion, speed?: number): Order | null;

    tryMakeOrderMoveToPlayer(player: IPlayer, speed?: number): Order | null;
    tryMakeOrderKickToPlayer(player: IPlayer, speed?: number): Order | null;

    tryMakeOrderLookAtPoint(point: IPoint): Order | null;
    tryMakeOrderLookAtDirection(direction: IVector2D): Order | null;

    tryMakeOrderJumpToPoint(target: IPoint, speed?: number): Order | null;

    makeOrderStop(): Order;

    makeOrderCatch(): Order;
}

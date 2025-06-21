import { AWAY_GOAL, HOME_GOAL, PlayerState, Point, SPECS, Side, Vector2D, Velocity } from '@/core.js';
import type {
    IBall,
    IGameInspector,
    IGoal,
    IPlayer,
    IPoint,
    IRegion,
    IShotClock,
    ITeam,
    IVector2D,
    IVelocity,
} from '@/interfaces.js';

import { Catch, Jump, Kick, Move, Order } from '@/generated/server.js';

import {
    ErrAwayTeamNotFound,
    ErrBallNotFound,
    ErrHomeTeamNotFound,
    ErrJumpZeroDirection,
    ErrKickZeroDirection,
    ErrMoveZeroDirection,
    ErrPlayerNotFound,
} from '@/errors.js';

export class GameInspector implements IGameInspector {
    private me: IPlayer;
    private state: PlayerState;

    private readonly turn: number = 0;
    private readonly homeTeam: ITeam | null = null;
    private readonly awayTeam: ITeam | null = null;
    private readonly ball: IBall | null = null;
    private readonly shotClock: IShotClock | null = null;
    private readonly turnsBallInGoalZone: number = 0;

    constructor(
        playerSide: Side,
        playerNumber: number,
        homeTeam?: ITeam,
        awayTeam?: ITeam,
        ball?: IBall,
        shotClock?: IShotClock,
        turnsBallInGoalZone: number = 0,
        turn: number = 0
    ) {
        this.homeTeam = homeTeam ?? null;
        this.awayTeam = awayTeam ?? null;
        this.ball = ball ?? null;
        this.shotClock = shotClock ?? null;
        this.turnsBallInGoalZone = turnsBallInGoalZone;
        this.me = this.getPlayer(playerSide, playerNumber);
        this.state = this.definePlayerState();
        this.turn = turn;
    }

    getTurn(): number {
        return this.turn;
    }

    getPlayer(side: Side, number: number): IPlayer {
        const player = this.tryGetPlayer(side, number);

        if (!player) throw new ErrPlayerNotFound(side, number);

        return player;
    }

    tryGetPlayer(side: Side, number: number): IPlayer | null {
        const team = this.getTeam(side);

        if (team) {
            for (const playerItem of team.getPlayers()) {
                if (number === playerItem.getNumber()) {
                    return playerItem;
                }
            }
        }

        return null;
    }

    getTeam(side: Side): ITeam {
        if (side === Side.HOME) {
            if (!this.homeTeam) {
                throw new ErrHomeTeamNotFound();
            }

            return this.homeTeam;
        }

        if (!this.awayTeam) {
            throw new ErrAwayTeamNotFound();
        }

        return this.awayTeam;
    }

    getFieldCenter(): IPoint {
        return new Point(SPECS.FIELD_CENTER_X, SPECS.FIELD_CENTER_Y);
    }

    hasShotClock(): boolean {
        return !!this.shotClock;
    }

    getShotClock(): IShotClock | null {
        if (!this.shotClock) return null;
        return this.shotClock;
    }

    getBall(): IBall {
        if (!this.ball) throw new ErrBallNotFound();
        return this.ball;
    }

    getBallHolder(): IPlayer | null {
        return this.getBall().getHolder();
    }

    getBallHasHolder(): boolean {
        return this.getBall().hasHolder();
    }

    getBallTurnsInGoalZone(): number {
        return this.turnsBallInGoalZone ?? 0;
    }

    getBallRemainingTurnsInGoalZone(): number {
        return SPECS.BALL_TIME_IN_GOAL_ZONE - this.getBallTurnsInGoalZone();
    }

    getBallPosition(): IPoint {
        return this.getBall().getPosition();
    }

    getBallDirection(): IVector2D {
        return this.getBall().getDirection();
    }

    getBallSpeed(): number {
        return this.getBall().getSpeed();
    }

    getAttackGoal(): IGoal {
        return this.getMyTeamSide() === Side.HOME ? AWAY_GOAL : HOME_GOAL;
    }

    getDefenseGoal(): IGoal {
        return this.getMyTeamSide() === Side.HOME ? HOME_GOAL : AWAY_GOAL;
    }

    getMe(): IPlayer {
        return this.me;
    }

    getMyState(): PlayerState {
        return this.state;
    }

    getMyTeam(): ITeam {
        return this.getTeam(this.getMyTeamSide());
    }

    getMyNumber(): number {
        return this.me.getNumber();
    }

    getMyTeamSide(): Side {
        return this.me.getTeamSide();
    }

    getMyPosition(): IPoint {
        return this.me.getPosition();
    }

    getMyDirection(): IVector2D {
        return this.me.getDirection();
    }

    getMySpeed(): number {
        return this.me.getSpeed();
    }

    getMyVelocity(): IVelocity {
        return this.me.getVelocity();
    }

    getMyPlayers(): IPlayer[] {
        return this.getMyTeam().getPlayers();
    }

    getMyGoalkeeper(): IPlayer {
        return this.getPlayer(this.getMyTeamSide(), SPECS.GOALKEEPER_NUMBER);
    }

    tryGetMyGoalkeeper(): IPlayer | null {
        return this.tryGetPlayer(this.getMyTeamSide(), SPECS.GOALKEEPER_NUMBER);
    }

    getMyScore(): number {
        return this.getMyTeam().getScore();
    }

    getMyPlayer(number: number): IPlayer {
        return this.getPlayer(this.getMyTeamSide(), number);
    }

    tryGetMyPlayer(number: number): IPlayer | null {
        return this.tryGetPlayer(this.getMyTeamSide(), number);
    }

    getOpponentPlayer(number: number): IPlayer {
        return this.getPlayer(this.getOpponentSide(), number);
    }

    tryGetOpponentPlayer(number: number): IPlayer | null {
        return this.tryGetPlayer(this.getOpponentSide(), number);
    }

    getOpponentTeam(): ITeam {
        return this.getTeam(this.getOpponentSide());
    }

    getOpponentSide(): Side {
        return this.getMyTeamSide() === Side.HOME ? Side.AWAY : Side.HOME;
    }

    getOpponentPlayers(): IPlayer[] {
        return this.getOpponentTeam().getPlayers();
    }

    getOpponentGoalkeeper(): IPlayer {
        return this.getOpponentPlayer(SPECS.GOALKEEPER_NUMBER);
    }

    tryGetOpponentGoalkeeper(): IPlayer | null {
        return this.tryGetOpponentPlayer(SPECS.GOALKEEPER_NUMBER);
    }

    getOpponentScore(): number {
        return this.getOpponentTeam().getScore();
    }

    makeOrderMoveToPoint(point: IPoint, speed?: number): Order {
        const direction = this.getMyPosition().directionTo(point);
        return this.makeOrderMoveToDirection(direction, speed);
    }

    makeOrderKickToPoint(target: IPoint, speed: number = SPECS.BALL_MAX_SPEED): Order {
        const direction = this.getBallPosition().directionTo(target);
        return this.makeOrderKickToDirection(direction, speed);
    }

    makeOrderMoveToDirection(direction: IVector2D, speed: number = SPECS.PLAYER_MAX_SPEED): Order {
        if (direction.is(new Vector2D(0, 0))) throw new ErrMoveZeroDirection();

        const vel = new Velocity(direction, speed);

        const move = Move.create({ velocity: vel.toLugoVelocity() });

        return Order.create({ action: { oneofKind: 'move', move } });
    }

    makeOrderKickToDirection(direction: IVector2D, speed: number = SPECS.BALL_MAX_SPEED): Order {
        if (direction.is(new Vector2D(0, 0))) throw new ErrKickZeroDirection();

        const vel = new Velocity(direction, speed);

        const kick = Kick.create({ velocity: vel.toLugoVelocity() });

        return Order.create({ action: { oneofKind: 'kick', kick } });
    }

    makeOrderMoveToRegion(region: IRegion, speed: number = SPECS.PLAYER_MAX_SPEED): Order {
        const direction = this.getMyPosition().directionTo(region.getCenter());
        return this.makeOrderMoveToDirection(direction, speed);
    }

    makeOrderKickToRegion(region: IRegion, speed: number = SPECS.BALL_MAX_SPEED): Order {
        const direction = this.getMyPosition().directionTo(region.getCenter());
        return this.makeOrderKickToDirection(direction, speed);
    }

    makeOrderMoveToPlayer(player: IPlayer, speed: number = SPECS.PLAYER_MAX_SPEED): Order {
        const direction = this.getMyPosition().directionTo(player.getPosition());
        return this.makeOrderMoveToDirection(direction, speed);
    }

    makeOrderKickToPlayer(player: IPlayer, speed: number = SPECS.BALL_MAX_SPEED): Order {
        const direction = this.getMyPosition().directionTo(player.getPosition());
        return this.makeOrderKickToDirection(direction, speed);
    }

    makeOrderLookAtPoint(point: IPoint): Order {
        return this.makeOrderLookAtDirection(this.getMyPosition().directionTo(point));
    }

    makeOrderLookAtDirection(direction: IVector2D): Order {
        return this.makeOrderMoveToDirection(direction, 0);
    }

    makeOrderJumpToPoint(target: IPoint, speed: number = SPECS.GOALKEEPER_JUMP_MAX_SPEED): Order {
        const origin = this.getMyPosition();
        const direction = origin.directionTo(target);
        if (direction.is(new Vector2D(0, 0))) throw new ErrJumpZeroDirection();
        const upOrDown = direction.getY() > 0 ? new Vector2D(0, 1) : new Vector2D(0, -1);
        const vel = new Velocity(upOrDown, speed);

        const jump = Jump.create({ velocity: vel.toLugoVelocity() });

        return Order.create({ action: { oneofKind: 'jump', jump } });
    }

    tryMakeOrderMoveToPoint(point: IPoint, speed: number = SPECS.PLAYER_MAX_SPEED): Order | null {
        const direction = this.getMe().getPosition().directionTo(point);
        return this.tryMakeOrderMoveToDirection(direction, speed);
    }

    tryMakeOrderKickToPoint(target: IPoint, speed: number = SPECS.BALL_MAX_SPEED): Order | null {
        const direction = this.getMe().getPosition().directionTo(target);
        return this.tryMakeOrderKickToDirection(direction, speed);
    }

    tryMakeOrderMoveToDirection(direction: IVector2D, speed: number = SPECS.PLAYER_MAX_SPEED): Order | null {
        if (direction.is(new Vector2D(0, 0))) return null;

        const vel = new Velocity(direction, speed);

        const move = Move.create({ velocity: vel.toLugoVelocity() });

        return Order.create({ action: { oneofKind: 'move', move } });
    }

    tryMakeOrderKickToDirection(direction: IVector2D, speed: number = SPECS.BALL_MAX_SPEED): Order | null {
        if (direction.is(new Vector2D(0, 0))) return null;

        const vel = new Velocity(direction, speed);

        const kick = Kick.create({ velocity: vel.toLugoVelocity() });

        return Order.create({ action: { oneofKind: 'kick', kick } });
    }

    tryMakeOrderMoveToRegion(region: IRegion, speed: number = SPECS.PLAYER_MAX_SPEED): Order | null {
        const direction = this.getMe().getPosition().directionTo(region.getCenter());
        return this.tryMakeOrderMoveToDirection(direction, speed);
    }

    tryMakeOrderKickToRegion(region: IRegion, speed: number = SPECS.BALL_MAX_SPEED): Order | null {
        const direction = this.getMe().getPosition().directionTo(region.getCenter());
        return this.tryMakeOrderKickToDirection(direction, speed);
    }

    tryMakeOrderMoveToPlayer(player: IPlayer, speed: number = SPECS.PLAYER_MAX_SPEED): Order | null {
        const direction = this.getMe().getPosition().directionTo(player.getPosition());
        return this.tryMakeOrderMoveToDirection(direction, speed);
    }

    tryMakeOrderKickToPlayer(player: IPlayer, speed: number = SPECS.BALL_MAX_SPEED): Order | null {
        const direction = this.getMe().getPosition().directionTo(player.getPosition());
        return this.tryMakeOrderKickToDirection(direction, speed);
    }

    tryMakeOrderLookAtPoint(point: IPoint): Order | null {
        const direction = this.getMe().getPosition().directionTo(point);
        return this.tryMakeOrderLookAtDirection(direction);
    }

    tryMakeOrderLookAtDirection(direction: IVector2D): Order | null {
        return this.tryMakeOrderMoveToDirection(direction, 0);
    }

    tryMakeOrderJumpToPoint(target: IPoint, speed: number = SPECS.GOALKEEPER_JUMP_MAX_SPEED): Order | null {
        const origin = this.getMyPosition();
        const direction = origin.directionTo(target);
        if (direction.is(new Vector2D(0, 0))) return null;
        const upOrDown = direction.getY() > 0 ? new Vector2D(0, 1) : new Vector2D(0, -1);
        const vel = new Velocity(upOrDown, speed);

        const jump = Jump.create({ velocity: vel.toLugoVelocity() });

        return Order.create({ action: { oneofKind: 'jump', jump } });
    }

    makeOrderStop(): Order {
        return this.makeOrderLookAtDirection(this.getMyDirection());
    }

    makeOrderCatch(): Order {
        return Order.create({ action: { oneofKind: 'catch', catch: Catch.create() } });
    }

    private definePlayerState(): PlayerState {
        const ballHolder = this.getBall().getHolder();
        if (!ballHolder) {
            return PlayerState.DISPUTING;
        }

        if (ballHolder.is(this.getMe())) {
            return PlayerState.HOLDING;
        }

        if (ballHolder.getTeamSide() === this.getMyTeamSide()) {
            return PlayerState.SUPPORTING;
        }

        return PlayerState.DEFENDING;
    }
}

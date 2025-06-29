import { Catch, Jump, Kick, Move, Order } from '@/generated/server.js';

import { IGameInspector } from '@/interfaces/game-inspector.js';
import { PlayerState } from '@/interfaces/player.js';

import { Ball } from '@/core/ball.js';
import { AWAY_GOAL, Goal, HOME_GOAL } from '@/core/goal.js';
import { Player } from '@/core/player.js';
import { Point } from '@/core/point.js';
import { Region } from '@/core/region.js';
import { ShotClock } from '@/core/shot-clock.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';
import { Team } from '@/core/team.js';
import { Vector2D } from '@/core/vector.js';
import { Velocity } from '@/core/velocity.js';

import {
    ErrBallNotFound,
    ErrJumpZeroDirection,
    ErrKickZeroDirection,
    ErrMoveZeroDirection,
    ErrPlayerNotFound,
    ErrTeamNotFound,
} from '@/errors.js';

import { toLugoVelocity } from '@/lugo.js';

export class GameInspector implements IGameInspector {
    private readonly me: Player;
    private readonly state: PlayerState;

    private readonly turn: number = 0;
    private readonly homeTeam: Team | null = null;
    private readonly awayTeam: Team | null = null;
    private readonly ball: Ball | null = null;
    private readonly shotClock: ShotClock | null = null;
    private readonly turnsBallInGoalZone: number = 0;

    constructor(
        playerSide: Side,
        playerNumber: number,
        homeTeam?: Team,
        awayTeam?: Team,
        ball?: Ball,
        shotClock?: ShotClock,
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

    getPlayer(side: Side, number: number): Player {
        const player = this.tryGetPlayer(side, number);

        if (!player) throw new ErrPlayerNotFound(side, number);

        return player;
    }

    tryGetPlayer(side: Side, number: number): Player | null {
        const team = this.getTeam(side);

        if (team) return team.tryGetPlayer(number);

        return null;
    }

    getTeam(side: Side): Team {
        if (side === Side.HOME) {
            if (!this.homeTeam) {
                throw new ErrTeamNotFound(Side.HOME);
            }

            return this.homeTeam;
        }

        if (!this.awayTeam) {
            throw new ErrTeamNotFound(Side.AWAY);
        }

        return this.awayTeam;
    }

    hasShotClock(): boolean {
        return !!this.shotClock;
    }

    getShotClock(): ShotClock | null {
        if (!this.shotClock) return null;
        return this.shotClock;
    }

    getBall(): Ball {
        if (!this.ball) throw new ErrBallNotFound();
        return this.ball;
    }

    getBallHolder(): Player | null {
        return this.getBall().getHolder();
    }
    getBallHasHolder(): boolean {
        return this.getBall().hasHolder();
    }

    getBallTurnsInGoalZone(): number {
        return this.turnsBallInGoalZone ?? 0;
    }

    getBallRemainingTurnsInGoalZone(): number {
        return SPECS.BALL_MAX_TURNS_IN_GOAL_ZONE - this.getBallTurnsInGoalZone();
    }

    getBallPosition(): Point {
        return this.getBall().getPosition();
    }

    getBallDirection(): Vector2D {
        return this.getBall().getDirection();
    }

    getBallSpeed(): number {
        return this.getBall().getSpeed();
    }

    getAttackGoal(): Goal {
        return this.getMyTeamSide() === Side.HOME ? AWAY_GOAL : HOME_GOAL;
    }

    getDefenseGoal(): Goal {
        return this.getMyTeamSide() === Side.HOME ? HOME_GOAL : AWAY_GOAL;
    }

    getMe(): Player {
        return this.me;
    }

    getMyState(): PlayerState {
        return this.state;
    }

    getMyTeam(): Team {
        return this.getTeam(this.getMyTeamSide());
    }

    getMyNumber(): number {
        return this.me.getNumber();
    }

    getMyTeamSide(): Side {
        return this.me.getTeamSide();
    }

    getMyPosition(): Point {
        return this.me.getPosition();
    }

    getMyDirection(): Vector2D {
        return this.me.getDirection();
    }

    getMySpeed(): number {
        return this.me.getSpeed();
    }

    getMyVelocity(): Velocity {
        return this.me.getVelocity();
    }

    getMyPlayers(): Player[] {
        return this.getMyTeam().getPlayers();
    }

    getMyGoalkeeper(): Player {
        return this.getPlayer(this.getMyTeamSide(), SPECS.GOALKEEPER_NUMBER);
    }

    tryGetMyGoalkeeper(): Player | null {
        return this.tryGetPlayer(this.getMyTeamSide(), SPECS.GOALKEEPER_NUMBER);
    }

    getMyScore(): number {
        return this.getMyTeam().getScore();
    }

    getMyPlayer(number: number): Player {
        return this.getPlayer(this.getMyTeamSide(), number);
    }

    tryGetMyPlayer(number: number): Player | null {
        return this.tryGetPlayer(this.getMyTeamSide(), number);
    }

    getOpponentPlayer(number: number): Player {
        return this.getPlayer(this.getOpponentSide(), number);
    }

    tryGetOpponentPlayer(number: number): Player | null {
        return this.tryGetPlayer(this.getOpponentSide(), number);
    }

    getOpponentTeam(): Team {
        return this.getTeam(this.getOpponentSide());
    }

    getOpponentSide(): Side {
        return this.getMyTeamSide() === Side.HOME ? Side.AWAY : Side.HOME;
    }

    getOpponentPlayers(): Player[] {
        return this.getOpponentTeam().getPlayers();
    }

    getOpponentGoalkeeper(): Player {
        return this.getOpponentPlayer(SPECS.GOALKEEPER_NUMBER);
    }

    tryGetOpponentGoalkeeper(): Player | null {
        return this.tryGetOpponentPlayer(SPECS.GOALKEEPER_NUMBER);
    }

    getOpponentScore(): number {
        return this.getOpponentTeam().getScore();
    }

    makeOrderMoveToPoint(point: Point, speed?: number): Order {
        const direction = this.getMyPosition().directionTo(point);
        return this.makeOrderMoveToDirection(direction, speed);
    }

    makeOrderKickToPoint(target: Point, speed: number = SPECS.BALL_MAX_SPEED): Order {
        const direction = this.getBallPosition().directionTo(target);
        return this.makeOrderKickToDirection(direction, speed);
    }

    makeOrderMoveToDirection(direction: Vector2D, speed: number = SPECS.PLAYER_MAX_SPEED): Order {
        if (direction.is(new Vector2D(0, 0))) throw new ErrMoveZeroDirection();

        const vel = new Velocity(direction, speed);

        const move = Move.create({ velocity: toLugoVelocity(vel) });

        return Order.create({ action: { oneofKind: 'move', move } });
    }

    makeOrderKickToDirection(direction: Vector2D, speed: number = SPECS.BALL_MAX_SPEED): Order {
        if (direction.is(new Vector2D(0, 0))) throw new ErrKickZeroDirection();

        const vel = new Velocity(direction, speed);

        const kick = Kick.create({ velocity: toLugoVelocity(vel) });

        return Order.create({ action: { oneofKind: 'kick', kick } });
    }

    makeOrderMoveToRegion(region: Region, speed: number = SPECS.PLAYER_MAX_SPEED): Order {
        const direction = this.getMyPosition().directionTo(region.getCenter());
        return this.makeOrderMoveToDirection(direction, speed);
    }

    makeOrderKickToRegion(region: Region, speed: number = SPECS.BALL_MAX_SPEED): Order {
        const direction = this.getBallPosition().directionTo(region.getCenter());
        return this.makeOrderKickToDirection(direction, speed);
    }

    makeOrderMoveToPlayer(player: Player, speed: number = SPECS.PLAYER_MAX_SPEED): Order {
        const direction = this.getMyPosition().directionTo(player.getPosition());
        return this.makeOrderMoveToDirection(direction, speed);
    }

    makeOrderKickToPlayer(player: Player, speed: number = SPECS.BALL_MAX_SPEED): Order {
        const direction = this.getBallPosition().directionTo(player.getPosition());
        return this.makeOrderKickToDirection(direction, speed);
    }

    makeOrderLookAtPoint(point: Point): Order {
        return this.makeOrderLookAtDirection(this.getMyPosition().directionTo(point));
    }

    makeOrderLookAtDirection(direction: Vector2D): Order {
        return this.makeOrderMoveToDirection(direction, 0);
    }

    makeOrderJumpToPoint(target: Point, speed: number = SPECS.GOALKEEPER_JUMP_MAX_SPEED): Order {
        const origin = this.getMyPosition();
        const direction = origin.directionTo(target);
        if (direction.is(new Vector2D(0, 0))) throw new ErrJumpZeroDirection();
        const upOrDown = direction.getY() > 0 ? new Vector2D(0, 1) : new Vector2D(0, -1);
        const vel = new Velocity(upOrDown, speed);

        const jump = Jump.create({ velocity: toLugoVelocity(vel) });

        return Order.create({ action: { oneofKind: 'jump', jump } });
    }

    tryMakeOrderMoveToPoint(point: Point, speed: number = SPECS.PLAYER_MAX_SPEED): Order | null {
        const direction = this.getMe().getPosition().directionTo(point);
        return this.tryMakeOrderMoveToDirection(direction, speed);
    }

    tryMakeOrderKickToPoint(target: Point, speed: number = SPECS.BALL_MAX_SPEED): Order | null {
        const direction = this.getBallPosition().directionTo(target);
        return this.tryMakeOrderKickToDirection(direction, speed);
    }

    tryMakeOrderMoveToDirection(direction: Vector2D, speed: number = SPECS.PLAYER_MAX_SPEED): Order | null {
        if (direction.is(new Vector2D(0, 0))) return null;

        const vel = new Velocity(direction, speed);

        const move = Move.create({ velocity: toLugoVelocity(vel) });

        return Order.create({ action: { oneofKind: 'move', move } });
    }

    tryMakeOrderKickToDirection(direction: Vector2D, speed: number = SPECS.BALL_MAX_SPEED): Order | null {
        if (direction.is(new Vector2D(0, 0))) return null;

        const vel = new Velocity(direction, speed);

        const kick = Kick.create({ velocity: toLugoVelocity(vel) });

        return Order.create({ action: { oneofKind: 'kick', kick } });
    }

    tryMakeOrderMoveToRegion(region: Region, speed: number = SPECS.PLAYER_MAX_SPEED): Order | null {
        const direction = this.getMe().getPosition().directionTo(region.getCenter());
        return this.tryMakeOrderMoveToDirection(direction, speed);
    }

    tryMakeOrderKickToRegion(region: Region, speed: number = SPECS.BALL_MAX_SPEED): Order | null {
        const direction = this.getBallPosition().directionTo(region.getCenter());
        return this.tryMakeOrderKickToDirection(direction, speed);
    }

    tryMakeOrderMoveToPlayer(player: Player, speed: number = SPECS.PLAYER_MAX_SPEED): Order | null {
        const direction = this.getMe().getPosition().directionTo(player.getPosition());
        return this.tryMakeOrderMoveToDirection(direction, speed);
    }

    tryMakeOrderKickToPlayer(player: Player, speed: number = SPECS.BALL_MAX_SPEED): Order | null {
        const direction = this.getBallPosition().directionTo(player.getPosition());
        return this.tryMakeOrderKickToDirection(direction, speed);
    }

    tryMakeOrderLookAtPoint(point: Point): Order | null {
        const direction = this.getMe().getPosition().directionTo(point);
        return this.tryMakeOrderLookAtDirection(direction);
    }

    tryMakeOrderLookAtDirection(direction: Vector2D): Order | null {
        return this.tryMakeOrderMoveToDirection(direction, 0);
    }

    tryMakeOrderJumpToPoint(target: Point, speed: number = SPECS.GOALKEEPER_JUMP_MAX_SPEED): Order | null {
        const origin = this.getMyPosition();
        const direction = origin.directionTo(target);
        if (direction.is(new Vector2D(0, 0))) return null;
        const upOrDown = direction.getY() > 0 ? new Vector2D(0, 1) : new Vector2D(0, -1);
        const vel = new Velocity(upOrDown, speed);

        const jump = Jump.create({ velocity: toLugoVelocity(vel) });

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

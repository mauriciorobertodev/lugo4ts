import { Point as LugoPoint, Vector as LugoVector, Velocity as LugoVelocity } from '@/generated/physics.js';
import {
    GameSnapshot_State,
    Ball as LugoBall,
    GameSnapshot as LugoGameSnapshot,
    Player as LugoPlayer,
    ShotClock as LugoShotClock,
    Team as LugoTeam,
    Team_Side,
} from '@/generated/server.js';

import {
    IBall,
    IGameSnapshot,
    IPlayer,
    IPoint,
    IShotClock,
    ITeam,
    IVector2D,
    IVelocity,
    ServerState,
} from '@/interfaces.js';

import { Ball, GameSnapshot, Player, Point, SPECS, ShotClock, Side, Team, Vector2D, Velocity } from '@/core.js';

import { intToSide, sideToInt, zeroedVelocity } from '@/utils.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function fromLugoPoint(lugoPoint: LugoPoint): Point {
    return new Point(lugoPoint.x, lugoPoint.y);
}

export function toLugoPoint(point: IPoint): LugoPoint {
    return LugoPoint.create({ x: Math.round(point.getX()), y: Math.round(point.getY()) });
}

export function fromLugoVector(lugoVector: LugoVector): Vector2D {
    return new Vector2D(lugoVector.x, lugoVector.y);
}

export function toLugoVector(vector: IVector2D): LugoVector {
    return LugoVector.create({ x: vector.getX(), y: vector.getY() });
}

export function fromLugoVelocity(lugoVelocity: LugoVelocity): Velocity {
    return new Velocity(fromLugoVector(lugoVelocity.direction ?? LugoVector.create()).normalize(), lugoVelocity.speed);
}

export function toLugoVelocity(velocity: IVelocity): LugoVelocity {
    return LugoVelocity.create({
        direction: toLugoVector(velocity.getDirection()),
        speed: velocity.getSpeed(),
    });
}

export function fromLugoPlayer(lugoPlayer: LugoPlayer): Player {
    return new Player(
        lugoPlayer.number,
        lugoPlayer.isJumping,
        lugoPlayer.teamSide === Team_Side.HOME ? Side.HOME : Side.AWAY,
        fromLugoPoint(lugoPlayer.position ?? LugoPoint.create()),
        fromLugoPoint(lugoPlayer.initPosition ?? LugoPoint.create()),
        fromLugoVelocity(lugoPlayer.velocity ?? LugoVelocity.create())
    );
}

export function toLugoPlayer(player: IPlayer): LugoPlayer {
    return LugoPlayer.create({
        number: player.getNumber(),
        isJumping: player.getIsJumping(),
        teamSide: sideToInt(player.getTeamSide()),
        position: toLugoPoint(player.getPosition()),
        initPosition: toLugoPoint(player.getInitPosition()),
        velocity: toLugoVelocity(player.getVelocity()),
    });
}

export function fromLugoBall(lugoBall: LugoBall): Ball {
    return new Ball(
        lugoBall.position ? fromLugoPoint(lugoBall.position) : new Point(SPECS.FIELD_CENTER_X, SPECS.FIELD_CENTER_Y),
        lugoBall.velocity ? fromLugoVelocity(lugoBall.velocity) : zeroedVelocity(),
        lugoBall.holder ? fromLugoPlayer(lugoBall.holder) : null
    );
}

export function toLugoBall(ball: IBall): LugoBall {
    return LugoBall.create({
        position: toLugoPoint(ball.getPosition()),
        velocity: toLugoVelocity(ball.getVelocity()),
        holder: ball.getHolder() ? toLugoPlayer(ball.getHolder()!) : undefined,
    });
}

export function fromLugoShotClock(lugoClock: LugoShotClock): ShotClock {
    return new ShotClock(intToSide(lugoClock.teamSide), lugoClock.remainingTurns ?? SPECS.SHOT_CLOCK_TIME);
}

export function toLugoShotClock(clock: IShotClock): LugoShotClock {
    return LugoShotClock.create({
        teamSide: sideToInt(clock.getHolderSide()),
        remainingTurns: clock.getRemainingTurnsWithBall(),
    });
}

export function fromLugoTeam(lugoTeam: LugoTeam): Team {
    const playersArray = lugoTeam.players ?? [];

    return new Team(
        lugoTeam.name ?? '',
        lugoTeam.score ?? 0,
        intToSide(lugoTeam.side ?? 0),
        playersArray.map((lugoPlayer: LugoPlayer) => fromLugoPlayer(lugoPlayer))
    );
}

export function toLugoTeam(team: ITeam): LugoTeam {
    return LugoTeam.create({
        name: team.getName(),
        score: team.getScore(),
        side: sideToInt(team.getSide()),
        players: team.getPlayers().map((player) => toLugoPlayer(player)),
    });
}

export function fromLugoGameState(state: GameSnapshot_State): ServerState {
    switch (state) {
        case GameSnapshot_State.WAITING:
            return ServerState.WAITING;
        case GameSnapshot_State.GET_READY:
            return ServerState.READY;
        case GameSnapshot_State.LISTENING:
            return ServerState.LISTENING;
        case GameSnapshot_State.PLAYING:
            return ServerState.PLAYING;
        case GameSnapshot_State.SHIFTING:
            return ServerState.SHIFTING;
        case GameSnapshot_State.OVER:
            return ServerState.OVER;
        default:
            throw new Error(`Unknown game state: ${state}`);
    }
}

export function toLugoGameState(state: ServerState): GameSnapshot_State {
    switch (state) {
        case ServerState.WAITING:
            return GameSnapshot_State.WAITING;
        case ServerState.READY:
            return GameSnapshot_State.GET_READY;
        case ServerState.LISTENING:
            return GameSnapshot_State.LISTENING;
        case ServerState.PLAYING:
            return GameSnapshot_State.PLAYING;
        case ServerState.SHIFTING:
            return GameSnapshot_State.SHIFTING;
        case ServerState.OVER:
            return GameSnapshot_State.OVER;
        default:
            throw new Error(`Unknown server state: ${state}`);
    }
}

export function fromLugoGameSnapshot(snapshot: LugoGameSnapshot): GameSnapshot {
    return new GameSnapshot(
        fromLugoGameState(snapshot.state),
        snapshot.turn,
        snapshot.homeTeam ? fromLugoTeam(snapshot.homeTeam) : undefined,
        snapshot.awayTeam ? fromLugoTeam(snapshot.awayTeam) : undefined,
        snapshot.ball ? fromLugoBall(snapshot.ball) : undefined,
        snapshot.turnsBallInGoalZone,
        snapshot.shotClock ? fromLugoShotClock(snapshot.shotClock) : undefined
    );
}

export function toLugoGameSnapshot(snapshot: IGameSnapshot): LugoGameSnapshot {
    return LugoGameSnapshot.create({
        state: toLugoGameState(snapshot.getState()),
        turn: snapshot.getTurn(),
        homeTeam: snapshot.getHomeTeam() ? toLugoTeam(snapshot.getHomeTeam()) : undefined,
        awayTeam: snapshot.getAwayTeam() ? toLugoTeam(snapshot.getAwayTeam()) : undefined,
        ball: snapshot.getBall() ? toLugoBall(snapshot.getBall()) : undefined,
        turnsBallInGoalZone: snapshot.getBallTurnsInGoalZone(),
        shotClock: snapshot.getShotClock() ? toLugoShotClock(snapshot.getShotClock()!) : undefined,
    });
}

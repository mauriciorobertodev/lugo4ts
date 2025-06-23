import { expect, test } from 'vitest';

import { Point as LugoPoint, Vector as LugoVector, Velocity } from '@/generated/physics.js';
import {
    GameSnapshot_State,
    Ball as LugoBall,
    GameSnapshot as LugoGameSnapshot,
    Player as LugoPlayer,
    ShotClock as LugoShotClock,
    Team as LugoTeam,
    Team_Side,
} from '@/generated/server.js';

import { ServerState } from '@/interfaces.js';

import {
    Ball,
    Velocity as CoreVelocity,
    GameSnapshot,
    Player,
    Point,
    ShotClock,
    Side,
    Team,
    Vector2D,
} from '@/core.js';

import { randomPoint, randomVector2D } from '@/utils.js';

import {
    fromLugoBall,
    fromLugoGameSnapshot,
    fromLugoGameState,
    fromLugoPlayer,
    fromLugoPoint,
    fromLugoShotClock,
    fromLugoTeam,
    fromLugoVector,
    fromLugoVelocity,
    toLugoBall,
    toLugoGameSnapshot,
    toLugoGameState,
    toLugoPlayer,
    toLugoPoint,
    toLugoShotClock,
    toLugoTeam,
    toLugoVector,
    toLugoVelocity,
} from '@/lugo.js';

test('DEVE criar um novo Point com base em um LugoPoint e ter os mesmos dados', () => {
    const lp = toLugoPoint(randomPoint());
    const lv = toLugoVector(randomVector2D());

    let pos1 = fromLugoPoint(lp);

    expect(pos1).toBeInstanceOf(Point);
    expect(pos1.getX()).toBe(lp.x);
    expect(pos1.getY()).toBe(lp.y);

    pos1 = fromLugoPoint(lp);

    expect(pos1).toBeInstanceOf(Point);
    expect(pos1.getX()).toBe(lp.x);
    expect(pos1.getY()).toBe(lp.y);

    pos1 = fromLugoPoint(lp);

    expect(pos1).toBeInstanceOf(Point);
    expect(pos1.getX()).toBe(lp.x);
    expect(pos1.getY()).toBe(lp.y);
});

test('DEVE retornar um LugoPoint com mesmos dados', () => {
    let pos = new Point(500, 200);
    let lp = toLugoPoint(pos);

    expect(typeof lp).toBe(typeof LugoPoint);
    expect(lp.x).toBe(pos.getX());
    expect(lp.y).toBe(pos.getY());

    pos = new Point(500.55, 200.66);
    lp = toLugoPoint(pos);

    expect(typeof lp).toBe(typeof LugoPoint);
    expect(lp.x).toBe(Math.round(pos.getX()));
    expect(lp.y).toBe(Math.round(pos.getY()));
    expect(lp.x).toBe(501);
    expect(lp.y).toBe(201);
});

test('DEVE retornar um LugoVector com mesmos dados', () => {
    let pos = new Point(500, 200);
    let vector = toLugoVector(pos);

    // expect(vector).toBeInstanceOf(LugoVector);
    expect(typeof vector).toBe(typeof LugoVector);
    expect(vector.x).toBe(pos.getX());
    expect(vector.y).toBe(pos.getY());

    pos = new Point(500.55, 200.66);
    vector = toLugoVector(pos);

    expect(typeof vector).toBe(typeof LugoVector);
    expect(vector.x).toBeCloseTo(pos.getX());
    expect(vector.y).toBeCloseTo(pos.getY());
});

test('fromLugoVector e toLugoVector', () => {
    const vector = new Vector2D(10, 20);
    const lugoVector = toLugoVector(vector);
    expect(lugoVector.x).toBe(10);
    expect(lugoVector.y).toBe(20);
    const coreVector = fromLugoVector(lugoVector);
    expect(coreVector.getX()).toBe(10);
    expect(coreVector.getY()).toBe(20);
});

test('fromLugoVelocity e toLugoVelocity', () => {
    const direction = LugoVector.create({ x: 1, y: 0 });
    const lugoVelocity = Velocity.create({ direction, speed: 5 });
    const coreVelocity = fromLugoVelocity(lugoVelocity);
    expect(coreVelocity.getSpeed()).toBe(5);
    expect(coreVelocity.getDirection().getX()).toBe(1);
    expect(coreVelocity.getDirection().getY()).toBe(0);
    const lugoVelocity2 = toLugoVelocity(coreVelocity);
    expect(lugoVelocity2.speed).toBe(5);
    expect(lugoVelocity2.direction?.x).toBeCloseTo(1);
    expect(lugoVelocity2.direction?.y).toBeCloseTo(0);
});

test('fromLugoPlayer e toLugoPlayer', () => {
    const lugoPlayer = LugoPlayer.create({
        number: 7,
        isJumping: true,
        teamSide: Team_Side.HOME,
        position: LugoPoint.create({ x: 10, y: 20 }),
        initPosition: LugoPoint.create({ x: 5, y: 15 }),
        velocity: Velocity.create({ direction: LugoVector.create({ x: 1, y: 0 }), speed: 3 }),
    });
    const corePlayer = fromLugoPlayer(lugoPlayer);
    expect(corePlayer.getNumber()).toBe(7);
    expect(corePlayer.getIsJumping()).toBe(true);
    expect(corePlayer.getTeamSide()).toBe(Side.HOME);
    expect(corePlayer.getPosition().getX()).toBe(10);
    expect(corePlayer.getInitPosition().getY()).toBe(15);
    expect(corePlayer.getVelocity().getSpeed()).toBe(3);
    const lugoPlayer2 = toLugoPlayer(corePlayer);
    expect(lugoPlayer2.number).toBe(7);
    expect(lugoPlayer2.isJumping).toBe(true);
    expect(lugoPlayer2.teamSide).toBe(Team_Side.HOME);
    expect(lugoPlayer2.position?.x).toBe(10);
    expect(lugoPlayer2.initPosition?.y).toBe(15);
    expect(lugoPlayer2.velocity?.speed).toBe(3);
});

test('fromLugoBall e toLugoBall', () => {
    const lugoBall = LugoBall.create({
        position: LugoPoint.create({ x: 100, y: 200 }),
        velocity: Velocity.create({ direction: LugoVector.create({ x: 0, y: 1 }), speed: 2 }),
        holder: LugoPlayer.create({
            number: 9,
            isJumping: false,
            teamSide: Team_Side.AWAY,
            position: LugoPoint.create({ x: 1, y: 2 }),
            initPosition: LugoPoint.create({ x: 3, y: 4 }),
            velocity: Velocity.create({ direction: LugoVector.create({ x: 0, y: 1 }), speed: 1 }),
        }),
    });
    const coreBall = fromLugoBall(lugoBall);
    expect(coreBall.getPosition().getX()).toBe(100);
    expect(coreBall.getVelocity().getSpeed()).toBe(2);
    expect(coreBall.getHolder()?.getNumber()).toBe(9);
    const lugoBall2 = toLugoBall(coreBall);
    expect(lugoBall2.position?.x).toBe(100);
    expect(lugoBall2.velocity?.speed).toBe(2);
    expect(lugoBall2.holder?.number).toBe(9);
});

test('fromLugoShotClock e toLugoShotClock', () => {
    const lugoClock = LugoShotClock.create({ teamSide: Team_Side.HOME, remainingTurns: 12 });
    const coreClock = fromLugoShotClock(lugoClock);
    expect(coreClock.getHolderSide()).toBe(Side.HOME);
    expect(coreClock.getRemainingTurnsWithBall()).toBe(12);
    const lugoClock2 = toLugoShotClock(coreClock);
    expect(lugoClock2.teamSide).toBe(Team_Side.HOME);
    expect(lugoClock2.remainingTurns).toBe(12);
});

test('fromLugoTeam e toLugoTeam', () => {
    const lugoTeam = LugoTeam.create({
        name: 'Time Azul',
        score: 3,
        side: Team_Side.AWAY,
        players: [
            LugoPlayer.create({
                number: 1,
                isJumping: false,
                teamSide: Team_Side.AWAY,
                position: LugoPoint.create({ x: 0, y: 0 }),
                initPosition: LugoPoint.create({ x: 0, y: 0 }),
                velocity: Velocity.create({ direction: LugoVector.create({ x: 0, y: 0 }), speed: 0 }),
            }),
        ],
    });
    const coreTeam = fromLugoTeam(lugoTeam);
    expect(coreTeam.getName()).toBe('Time Azul');
    expect(coreTeam.getScore()).toBe(3);
    expect(coreTeam.getSide()).toBe(Side.AWAY);
    expect(coreTeam.getPlayers().length).toBe(1);
    const lugoTeam2 = toLugoTeam(coreTeam);
    expect(lugoTeam2.name).toBe('Time Azul');
    expect(lugoTeam2.score).toBe(3);
    expect(lugoTeam2.side).toBe(Team_Side.AWAY);
    expect(lugoTeam2.players?.length).toBe(1);
});

test('fromLugoGameState e toLugoGameState', () => {
    expect(fromLugoGameState(GameSnapshot_State.WAITING)).toBe(ServerState.WAITING);
    expect(fromLugoGameState(GameSnapshot_State.GET_READY)).toBe(ServerState.READY);
    expect(fromLugoGameState(GameSnapshot_State.LISTENING)).toBe(ServerState.LISTENING);
    expect(fromLugoGameState(GameSnapshot_State.PLAYING)).toBe(ServerState.PLAYING);
    expect(fromLugoGameState(GameSnapshot_State.SHIFTING)).toBe(ServerState.SHIFTING);
    expect(fromLugoGameState(GameSnapshot_State.OVER)).toBe(ServerState.OVER);
    expect(() => fromLugoGameState(999 as any)).toThrow();

    expect(toLugoGameState(ServerState.WAITING)).toBe(GameSnapshot_State.WAITING);
    expect(toLugoGameState(ServerState.READY)).toBe(GameSnapshot_State.GET_READY);
    expect(toLugoGameState(ServerState.LISTENING)).toBe(GameSnapshot_State.LISTENING);
    expect(toLugoGameState(ServerState.PLAYING)).toBe(GameSnapshot_State.PLAYING);
    expect(toLugoGameState(ServerState.SHIFTING)).toBe(GameSnapshot_State.SHIFTING);
    expect(toLugoGameState(ServerState.OVER)).toBe(GameSnapshot_State.OVER);
    expect(() => toLugoGameState('INVALID' as any)).toThrow();
});

test('fromLugoGameSnapshot e toLugoGameSnapshot', () => {
    const lugoSnapshot = LugoGameSnapshot.create({
        state: GameSnapshot_State.PLAYING,
        turn: 42,
        homeTeam: LugoTeam.create({
            name: 'Casa',
            score: 1,
            side: Team_Side.HOME,
            players: [],
        }),
        awayTeam: LugoTeam.create({
            name: 'Fora',
            score: 2,
            side: Team_Side.AWAY,
            players: [],
        }),
        ball: LugoBall.create({
            position: LugoPoint.create({ x: 10, y: 20 }),
            velocity: Velocity.create({ direction: LugoVector.create({ x: 1, y: 1 }), speed: 2 }),
        }),
        turnsBallInGoalZone: 5,
        shotClock: LugoShotClock.create({ teamSide: Team_Side.HOME, remainingTurns: 8 }),
    });
    const coreSnapshot = fromLugoGameSnapshot(lugoSnapshot);
    expect(coreSnapshot.getState()).toBe(ServerState.PLAYING);
    expect(coreSnapshot.getTurn()).toBe(42);
    expect(coreSnapshot.getHomeTeam()?.getName()).toBe('Casa');
    expect(coreSnapshot.getAwayTeam()?.getScore()).toBe(2);
    expect(coreSnapshot.getBall()?.getPosition().getX()).toBe(10);
    expect(coreSnapshot.getBallTurnsInGoalZone()).toBe(5);
    expect(coreSnapshot.getShotClock()?.getRemainingTurnsWithBall()).toBe(8);
    const lugoSnapshot2 = toLugoGameSnapshot(coreSnapshot);
    expect(lugoSnapshot2.state).toBe(GameSnapshot_State.PLAYING);
    expect(lugoSnapshot2.turn).toBe(42);
    expect(lugoSnapshot2.homeTeam?.name).toBe('Casa');
    expect(lugoSnapshot2.awayTeam?.score).toBe(2);
    expect(lugoSnapshot2.ball?.position?.x).toBe(10);
    expect(lugoSnapshot2.turnsBallInGoalZone).toBe(5);
    expect(lugoSnapshot2.shotClock?.remainingTurns).toBe(8);
});

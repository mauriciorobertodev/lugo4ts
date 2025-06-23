import { beforeEach, describe, expect, test } from 'vitest';

import { Catch, Jump, Kick, Move, Order } from '@/generated/server.js';

import { ServerState } from '@/interfaces.js';

import {
    AWAY_GOAL,
    Ball,
    Compass,
    GameInspector,
    GameSnapshot,
    HOME_GOAL,
    Mapper,
    Player,
    PlayerState,
    Point,
    Region,
    SPECS,
    ShotClock,
    Side,
    Vector2D,
    Velocity,
} from '@/core.js';

import {
    fromGameSnapshot,
    randomBall,
    randomGameInspector,
    randomGameInspectorInAsGoalKeeper,
    randomGameInspectorInOnDefending,
    randomGameInspectorInOnDisputing,
    randomGameInspectorInOnHolding,
    randomGameInspectorInOnSupporting,
    randomGameSnapshot,
    randomPlayer,
    randomPoint,
    randomTeam,
    randomVector2D,
    zeroedBall,
} from '@/utils.js';

import {
    ErrJumpZeroDirection,
    ErrKickZeroDirection,
    ErrMoveZeroDirection,
    ErrPlayerNotFound,
    ErrTeamNotFound,
} from '@/errors.js';

import { toLugoVector } from '@/lugo.js';

describe('Core/GameInspector', () => {
    test('DEVE lançar exceção se o jogador não for encontrado', function () {
        const side = Side.HOME;
        const number = 1;

        const homeTeam = randomTeam({ side, populate: 0 });

        expect(() => new GameInspector(side, 1, homeTeam).getMe()).toThrow(ErrPlayerNotFound);
    });

    test('DEVE retornar corretamente as propriedades do game', function () {
        const playerSide = Side.HOME;
        const playerNumber = 1;
        const snapshot = randomGameSnapshot();
        const inspector = fromGameSnapshot(playerSide, playerNumber, snapshot);

        const me = snapshot.getHomePlayer(playerNumber)!;
        const player10 = snapshot.getHomePlayer(10);

        const opponent01 = snapshot.getAwayPlayer(1);
        const opponent10 = snapshot.getAwayPlayer(10);

        expect(inspector.getTurn()).toEqual(snapshot.getTurn());
        expect(inspector.getMe().getNumber()).toEqual(playerNumber);
        expect(inspector.getMe().getTeamSide()).toEqual(playerSide);
        expect(inspector.getMyNumber()).toEqual(playerNumber);
        expect(inspector.getMyTeamSide()).toEqual(playerSide);
        expect(inspector.getMyTeam()).toEqual(snapshot.getHomeTeam());
        expect(inspector.getMyGoalkeeper().getNumber()).toEqual(SPECS.GOALKEEPER_NUMBER);
        expect(inspector.getMyGoalkeeper().getTeamSide()).toEqual(playerSide);
        expect(inspector.tryGetMyGoalkeeper()?.getTeamSide()).toEqual(playerSide);
        expect(inspector.getMyPosition()).toEqual(me.getPosition());
        expect(inspector.getMyDirection()).toEqual(me.getDirection());
        expect(inspector.getMySpeed()).toEqual(me.getSpeed());
        expect(inspector.getMyVelocity()).toEqual(me.getVelocity());
        expect(inspector.getMyPlayers()).toEqual(snapshot.getHomeTeam().getPlayers());
        expect(inspector.getMyScore()).toEqual(snapshot.getHomeTeam().getScore());
        expect(inspector.getMyPlayer(10)).toEqual(player10);
        expect(inspector.tryGetMyPlayer(10)).toEqual(player10);

        expect(inspector.getOpponentGoalkeeper()).toEqual(opponent01);
        expect(inspector.tryGetOpponentGoalkeeper()).toEqual(opponent01);
        expect(inspector.getOpponentPlayer(10)).toEqual(opponent10);
        expect(inspector.tryGetOpponentPlayer(10)).toEqual(opponent10);
        expect(inspector.getOpponentPlayers()).toEqual(snapshot.getAwayTeam().getPlayers());
        expect(inspector.getOpponentScore()).toEqual(snapshot.getAwayTeam().getScore());
        expect(inspector.getOpponentSide()).toEqual(Side.AWAY);
        expect(inspector.getOpponentTeam()).toEqual(snapshot.getAwayTeam());

        expect(inspector.getTeam(Side.HOME)).toEqual(snapshot.getHomeTeam());
        expect(inspector.getTeam(Side.AWAY)).toEqual(snapshot.getAwayTeam());

        expect(inspector.getAttackGoal()).toEqual(AWAY_GOAL);
        expect(inspector.getDefenseGoal()).toEqual(HOME_GOAL);

        expect(inspector.getBall()).toEqual(snapshot.getBall());
        expect(inspector.getBallPosition()).toEqual(snapshot.getBall().getPosition());
        expect(inspector.getBallDirection()).toEqual(snapshot.getBall().getVelocity().getDirection().normalize());
        expect(inspector.getBallSpeed()).toEqual(snapshot.getBall().getVelocity().getSpeed());
        expect(inspector.getBallHolder()).toEqual(snapshot.getBall().getHolder());
        expect(inspector.getBallHasHolder()).toEqual(!!snapshot.getBall().getHolder());
        expect(inspector.getBallTurnsInGoalZone()).toEqual(snapshot.getBallTurnsInGoalZone());
        expect(inspector.getBallRemainingTurnsInGoalZone()).toEqual(
            SPECS.BALL_TIME_IN_GOAL_ZONE - snapshot.getBallTurnsInGoalZone()
        );

        expect(inspector.hasShotClock()).toEqual(!!snapshot.getShotClock());
        expect(inspector.getShotClock()).toEqual(snapshot.getShotClock());

        // Alguem tem a bola
        const inspector2 = randomGameInspectorInOnHolding({ playerSide: Side.HOME, playerNumber: 7 });
        expect(inspector2.hasShotClock()).toEqual(true);
        expect(inspector.getShotClock()).toBeDefined();
        expect(inspector2.getShotClock()).toBeInstanceOf(ShotClock);

        // Alguem tem a bola
        const inspector3 = randomGameInspectorInOnDefending({ playerSide: Side.HOME, playerNumber: 7 });
        expect(inspector3.hasShotClock()).toEqual(true);
        expect(inspector.getShotClock()).toBeDefined();
        expect(inspector2.getShotClock()).toBeInstanceOf(ShotClock);

        // Ninguem tem a bola
        const inspector4 = randomGameInspectorInOnDisputing({ playerSide: Side.HOME, playerNumber: 7 });
        expect(inspector4.hasShotClock()).toEqual(false);
        expect(inspector.getShotClock()).toBeNull();
    });

    test('DEVE retornar null quando o método contém "try" e não foi possível executar a ação', function () {
        const me = randomPlayer({ side: Side.HOME, number: 2 });
        const inspector = fromGameSnapshot(
            Side.HOME,
            2,
            randomGameSnapshot({
                homeTeam: randomTeam({ side: Side.HOME, populate: 0, players: [me] }),
                awayTeam: randomTeam({ side: Side.AWAY, populate: 0 }),
            })
        );

        expect(inspector.tryGetMyGoalkeeper()).toBeNull();
        expect(inspector.tryGetMyPlayer(10)).toBeNull();
        expect(inspector.tryGetOpponentGoalkeeper()).toBeNull();
        expect(inspector.tryGetOpponentPlayer(10)).toBeNull();
        expect(inspector.tryGetPlayer(Side.HOME, 10)).toBeNull();
    });

    test('DEVE retornar uma ordem de movimentação para um ponto X', function () {
        const inspector = fromGameSnapshot(Side.HOME, 10, randomGameSnapshot());
        const me = inspector.getMe();

        const point = randomPoint();
        let order = inspector.makeOrderMoveToPoint(point);

        expect(order.action.oneofKind).toBe('move');
        if (order.action.oneofKind === 'move') {
            expect(order).toBeTypeOf(typeof Order);
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity?.direction).toEqual(toLugoVector(me.getPosition().directionTo(point)));
            expect(order.action.move.velocity?.speed).toEqual(SPECS.PLAYER_MAX_SPEED);
        }

        order = inspector.makeOrderMoveToPoint(point, 30);
        expect(order.action.oneofKind).toBe('move');
        if (order.action.oneofKind === 'move') {
            expect(order.action.move.velocity?.speed).toEqual(30);

            expect(() => inspector.makeOrderMoveToPoint(inspector.getMyPosition())).toThrow(ErrMoveZeroDirection);
        }
    });

    test('DEVE retornar uma ordem de chute para um ponto X', function () {
        const inspector = fromGameSnapshot(Side.HOME, 10, randomGameSnapshot());

        const point = randomPoint();

        let order = inspector.makeOrderKickToPoint(point);
        expect(order.action.oneofKind).toBe('kick');
        if (order.action.oneofKind === 'kick') {
            expect(order).toBeTypeOf(typeof Order);
            expect(order.action.kick).toBeTypeOf(typeof Kick);
            expect(order.action.kick.velocity?.direction).toEqual(
                toLugoVector(inspector.getBall().getPosition().directionTo(point))
            );
            expect(order.action.kick.velocity?.speed).toEqual(SPECS.BALL_MAX_SPEED);
        }

        order = inspector.makeOrderKickToPoint(point, 30);
        expect(order.action.oneofKind).toBe('kick');
        if (order.action.oneofKind === 'kick') {
            expect(order.action.kick.velocity?.speed).toEqual(30);

            expect(() => inspector.makeOrderKickToPoint(inspector.getBallPosition())).toThrow(ErrKickZeroDirection);
        }
    });

    test('DEVE retornar uma ordem de movimentação para uma direção X', function () {
        const inspector = fromGameSnapshot(Side.HOME, 10, randomGameSnapshot());

        const direction = Compass.randomDirection();
        let order = inspector.makeOrderMoveToDirection(direction);

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('move');
        if (order.action.oneofKind === 'move') {
            expect(order).toBeTypeOf(typeof Order);
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity?.direction).toEqual(toLugoVector(direction));
            expect(order.action.move.velocity?.speed).toEqual(SPECS.PLAYER_MAX_SPEED);
        }

        order = inspector.makeOrderMoveToDirection(direction, 30);
        expect(order.action.oneofKind).toBe('move');

        if (order.action.oneofKind === 'move') {
            expect(order.action.move.velocity?.speed).toEqual(30);
            expect(() => inspector.makeOrderMoveToDirection(new Vector2D(0, 0))).toThrow(ErrMoveZeroDirection);
        }
    });

    test('DEVE retornar uma ordem de chute para uma direção X', function () {
        const inspector = fromGameSnapshot(Side.HOME, 10, randomGameSnapshot());

        const direction = Compass.randomDirection();
        let order = inspector.makeOrderKickToDirection(direction);

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('kick');
        if (order.action.oneofKind === 'kick') {
            expect(order).toBeTypeOf(typeof Order);
            expect(order.action.kick).toBeTypeOf(typeof Kick);
            expect(order.action.kick.velocity?.direction).toEqual(toLugoVector(direction));
            expect(order.action.kick.velocity?.speed).toEqual(SPECS.BALL_MAX_SPEED);
        }

        order = inspector.makeOrderKickToDirection(direction, 30);
        expect(order.action.oneofKind).toBe('kick');
        if (order.action.oneofKind === 'kick') {
            expect(order.action.kick.velocity?.speed).toEqual(30);
            expect(() => inspector.makeOrderKickToDirection(new Vector2D(0, 0))).toThrow(ErrKickZeroDirection);
        }
    });

    test('DEVE retornar uma ordem de movimentação para uma região X', function () {
        const inspector = fromGameSnapshot(Side.HOME, 10, randomGameSnapshot());

        const mapper = new Mapper(10, 10, Side.HOME);
        let region = mapper.getRandomRegion();

        let order = inspector.makeOrderMoveToRegion(region);

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('move');
        if (order.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity?.direction).toEqual(
                toLugoVector(inspector.getMyPosition().directionTo(region.getCenter()))
            );
            expect(order.action.move.velocity?.speed).toEqual(SPECS.PLAYER_MAX_SPEED);
        }

        order = inspector.makeOrderMoveToRegion(region, 30);
        expect(order.action.oneofKind).toBe('move');
        if (order.action.oneofKind === 'move') {
            expect(order.action.move.velocity?.speed).toEqual(30);
            region = new Region(0, 0, Side.HOME, inspector.getMyPosition(), mapper);
            expect(() => inspector.makeOrderMoveToRegion(region)).toThrow(ErrMoveZeroDirection);
        }
    });

    test('DEVE retornar uma ordem de chute para uma região X', function () {
        const inspector = fromGameSnapshot(Side.HOME, 10, randomGameSnapshot());

        const mapper = new Mapper(10, 10, Side.HOME);

        let region = mapper.getRandomRegion();
        let order = inspector.makeOrderKickToRegion(region);

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('kick');
        if (order.action.oneofKind === 'kick') {
            expect(order.action.kick).toBeTypeOf(typeof Kick);
            expect(order.action.kick.velocity?.direction).toEqual(
                toLugoVector(inspector.getBallPosition().directionTo(region.getCenter()))
            );
            expect(order.action.kick.velocity?.speed).toEqual(SPECS.BALL_MAX_SPEED);
        }

        order = inspector.makeOrderKickToRegion(region, 30);
        expect(order.action.oneofKind).toBe('kick');
        if (order.action.oneofKind === 'kick') {
            expect(order.action.kick.velocity?.speed).toEqual(30);
            region = new Region(0, 0, Side.HOME, inspector.getBallPosition(), mapper);
            expect(() =>
                inspector.makeOrderKickToRegion(new Region(0, 0, Side.HOME, inspector.getBallPosition(), mapper))
            ).toThrow(ErrKickZeroDirection);
        }
    });

    test('DEVE retornar uma ordem de movimentação para um player X', function () {
        const inspector = fromGameSnapshot(Side.HOME, 10, randomGameSnapshot());

        let otherPlayer = randomPlayer();

        let order = inspector.makeOrderMoveToPlayer(otherPlayer);

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('move');
        if (order.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity?.direction).toEqual(
                toLugoVector(inspector.getMyPosition().directionTo(otherPlayer.getPosition()))
            );
            expect(order.action.move.velocity?.speed).toEqual(SPECS.PLAYER_MAX_SPEED);
        }

        order = inspector.makeOrderMoveToPlayer(otherPlayer, 30);
        expect(order.action.oneofKind).toBe('move');
        if (order.action.oneofKind === 'move') {
            expect(order.action.move.velocity?.speed).toEqual(30);
            otherPlayer = randomPlayer({ position: inspector.getMyPosition() });
            expect(() => inspector.makeOrderMoveToPlayer(otherPlayer)).toThrow(ErrMoveZeroDirection);
        }
    });

    test('DEVE retornar uma ordem de chute para um player X', function () {
        const inspector = fromGameSnapshot(Side.HOME, 10, randomGameSnapshot());

        let otherPlayer = randomPlayer();

        let order = inspector.makeOrderKickToPlayer(otherPlayer);

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('kick');
        if (order.action.oneofKind === 'kick') {
            expect(order.action.kick).toBeTypeOf(typeof Kick);
            expect(order.action.kick.velocity?.direction).toEqual(
                toLugoVector(inspector.getBallPosition().directionTo(otherPlayer.getPosition()))
            );
            expect(order.action.kick.velocity?.speed).toEqual(SPECS.BALL_MAX_SPEED);
        }

        order = inspector.makeOrderKickToPlayer(otherPlayer, 30);
        expect(order.action.oneofKind).toBe('kick');
        if (order.action.oneofKind === 'kick') {
            expect(order.action.kick.velocity?.speed).toEqual(30);
            otherPlayer = randomPlayer({ position: inspector.getBallPosition() });
            expect(() => inspector.makeOrderKickToPlayer(otherPlayer)).toThrow(ErrKickZeroDirection);
        }
    });

    test('DEVE retornar uma ordem de pulo para um ponto X', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        let point = randomPoint();
        let order = inspector.makeOrderJumpToPoint(point);

        let direction = inspector.getMyPosition().directionTo(point);
        let upOrDown = direction.getY() > 0 ? new Vector2D(0, 1) : new Vector2D(0, -1);

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('jump');
        if (order.action.oneofKind === 'jump') {
            expect(order.action.jump).toBeTypeOf(typeof Jump);
            expect(order.action.jump.velocity?.direction).toEqual(toLugoVector(upOrDown));
            expect(order.action.jump.velocity?.speed).toEqual(SPECS.GOALKEEPER_JUMP_MAX_SPEED);
        }

        order = inspector.makeOrderJumpToPoint(point, 30);
        expect(order.action.oneofKind).toBe('jump');
        if (order.action.oneofKind === 'jump') {
            expect(order.action.jump.velocity?.speed).toEqual(30);
            expect(() => inspector.makeOrderJumpToPoint(inspector.getMyPosition())).toThrow(ErrJumpZeroDirection);
        }
    });

    test('DEVE retornar uma ordem de movimentação para um ponto X com velocidade 0', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());
        let point = randomPoint();
        let order = inspector.makeOrderLookAtPoint(point);

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('move');
        if (order.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity).toBeDefined();
            expect(order.action.move.velocity?.direction).toEqual(
                toLugoVector(inspector.getMyPosition().directionTo(point))
            );
            expect(order.action.move.velocity?.speed).toEqual(0);
        }

        expect(() => inspector.makeOrderLookAtPoint(inspector.getMyPosition())).toThrow(ErrMoveZeroDirection);
    });

    test('DEVE retornar uma ordem de movimentação para uma direção X com velocidade 0', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        let direction = Compass.randomDirection();
        let order = inspector.makeOrderLookAtDirection(direction);

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('move');
        if (order.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity).toBeDefined();
            expect(order.action.move.velocity?.direction).toEqual(toLugoVector(direction));
            expect(order.action.move.velocity?.speed).toEqual(0);
        }

        expect(() => inspector.makeOrderLookAtDirection(new Vector2D(0, 0))).toThrow(ErrMoveZeroDirection);
    });

    test('DEVE retornar corretamente o estado do jogador', function () {
        let inspector = randomGameInspectorInOnDefending({ playerSide: Side.HOME, playerNumber: 10 });
        expect(inspector.getMyState()).toBe(PlayerState.DEFENDING);

        inspector = randomGameInspectorInOnSupporting({ playerSide: Side.HOME, playerNumber: 10 });
        expect(inspector.getMyState()).toBe(PlayerState.SUPPORTING);

        inspector = randomGameInspectorInOnHolding({ playerSide: Side.HOME, playerNumber: 10 });
        expect(inspector.getMyState()).toBe(PlayerState.HOLDING);

        inspector = randomGameInspectorInOnDisputing({ playerSide: Side.HOME, playerNumber: 10 });
        expect(inspector.getMyState()).toBe(PlayerState.DISPUTING);

        inspector = randomGameInspectorInAsGoalKeeper({ playerSide: Side.HOME, playerState: PlayerState.DEFENDING });
        expect(inspector.getMyState()).toBe(PlayerState.DEFENDING);
        inspector = randomGameInspectorInAsGoalKeeper({ playerSide: Side.HOME, playerState: PlayerState.SUPPORTING });
        expect(inspector.getMyState()).toBe(PlayerState.SUPPORTING);
        inspector = randomGameInspectorInAsGoalKeeper({ playerSide: Side.HOME, playerState: PlayerState.HOLDING });
        expect(inspector.getMyState()).toBe(PlayerState.HOLDING);
        inspector = randomGameInspectorInAsGoalKeeper({ playerSide: Side.HOME, playerState: PlayerState.DISPUTING });
        expect(inspector.getMyState()).toBe(PlayerState.DISPUTING);
    });

    test('DEVE retornar uma ordem de pegar a bola', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        let order = inspector.makeOrderCatch();

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('catch');
        if (order.action.oneofKind === 'catch') {
            expect(order.action.catch).toBeTypeOf(typeof Catch);
        }
    });

    test('DEVE retornar uma ordem de movimentação para a direção atual com velocidade 0', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        let order = inspector.makeOrderStop();

        expect(order).toBeTypeOf(typeof Order);
        expect(order.action.oneofKind).toBe('move');
        if (order.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity).toBeDefined();
            expect(order.action.move.velocity?.direction).toEqual(toLugoVector(inspector.getMyDirection()));
            expect(order.action.move.velocity?.speed).toEqual(0);
        }
    });

    // ##########################
    test('DEVE retornar uma ordem de movimentação para um ponto X ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        const me = inspector.getMe();
        const myPosition = me.getPosition();

        let point = randomPoint();
        let order = inspector.tryMakeOrderMoveToPoint(point);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('move');
        if (order?.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity?.direction).toEqual(toLugoVector(myPosition.directionTo(point)));
            expect(order.action.move.velocity?.speed).toEqual(SPECS.PLAYER_MAX_SPEED);
        }

        order = inspector.tryMakeOrderMoveToPoint(point, 30);
        expect(order?.action.oneofKind).toBe('move');
        if (order?.action.oneofKind === 'move') {
            expect(order.action.move.velocity?.speed).toEqual(30);
        }

        expect(inspector.tryMakeOrderMoveToPoint(inspector.getMyPosition())).toBeNull();
    });

    test('DEVE retornar uma ordem de chute para um ponto X ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());
        const me = inspector.getMe();
        const myPosition = me.getPosition();

        let point = randomPoint();
        let order = inspector.tryMakeOrderKickToPoint(point);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('kick');
        if (order?.action.oneofKind === 'kick') {
            expect(order.action.kick).toBeTypeOf(typeof Kick);
            expect(order.action.kick.velocity?.direction).toEqual(
                toLugoVector(inspector.getBallPosition().directionTo(point))
            );
            expect(order.action.kick.velocity?.speed).toEqual(SPECS.BALL_MAX_SPEED);
        }
        order = inspector.tryMakeOrderKickToPoint(point, 30);
        expect(order?.action.oneofKind).toBe('kick');
        if (order?.action.oneofKind === 'kick') {
            expect(order.action.kick.velocity?.speed).toEqual(30);
        }

        expect(inspector.tryMakeOrderKickToPoint(inspector.getBallPosition())).toBeNull();
    });

    test('DEVE retornar uma ordem de movimentação para uma direção X ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        let direction = Compass.randomDirection();
        let order = inspector.tryMakeOrderMoveToDirection(direction);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('move');
        if (order?.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity?.direction).toEqual(toLugoVector(direction));
            expect(order.action.move.velocity?.speed).toEqual(SPECS.PLAYER_MAX_SPEED);
        }

        order = inspector.tryMakeOrderMoveToDirection(direction, 30);
        expect(order?.action.oneofKind).toBe('move');
        if (order?.action.oneofKind === 'move') {
            expect(order.action.move.velocity?.speed).toEqual(30);
        }

        expect(inspector.tryMakeOrderMoveToDirection(new Vector2D(0, 0))).toBeNull();
    });

    test('DEVE retornar uma ordem de chute para uma direção X ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        let direction = Compass.randomDirection();
        let order = inspector.tryMakeOrderKickToDirection(direction);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('kick');
        if (order?.action.oneofKind === 'kick') {
            expect(order.action.kick).toBeTypeOf(typeof Kick);
            expect(order.action.kick.velocity?.direction).toEqual(toLugoVector(direction));
            expect(order.action.kick.velocity?.speed).toEqual(SPECS.BALL_MAX_SPEED);
        }

        order = inspector.tryMakeOrderKickToDirection(direction, 30);
        expect(order?.action.oneofKind).toBe('kick');
        if (order?.action.oneofKind === 'kick') {
            expect(order.action.kick.velocity?.speed).toEqual(30);
        }

        expect(inspector.tryMakeOrderKickToDirection(new Vector2D(0, 0))).toBeNull();
    });

    test('DEVE retornar uma ordem de movimentação para uma região X ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        const me = inspector.getMe();
        const myPosition = me.getPosition();

        let mapper = new Mapper(10, 10, Side.HOME);
        let region = mapper.getRandomRegion();

        let order = inspector.tryMakeOrderMoveToRegion(region);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('move');
        if (order?.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity?.direction).toEqual(
                toLugoVector(myPosition.directionTo(region.getCenter()))
            );
            expect(order.action.move.velocity?.speed).toEqual(SPECS.PLAYER_MAX_SPEED);
        }

        order = inspector.tryMakeOrderMoveToRegion(region, 30);
        expect(order?.action.oneofKind).toBe('move');
        if (order?.action.oneofKind === 'move') {
            expect(order.action.move.velocity?.speed).toEqual(30);
        }

        region = new Region(0, 0, Side.HOME, inspector.getMyPosition(), mapper);
        expect(inspector.tryMakeOrderMoveToRegion(region)).toBeNull();
    });

    test('DEVE retornar uma ordem de chute para uma região X ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());
        const me = inspector.getMe();
        const myPosition = me.getPosition();

        let mapper = new Mapper(10, 10, Side.HOME);
        let region = mapper.getRandomRegion();

        let order = inspector.tryMakeOrderKickToRegion(region);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('kick');
        if (order?.action.oneofKind === 'kick') {
            expect(order.action.kick).toBeTypeOf(typeof Kick);
            expect(order.action.kick.velocity?.direction).toEqual(
                toLugoVector(inspector.getBallPosition().directionTo(region.getCenter()))
            );
            expect(order.action.kick.velocity?.speed).toEqual(SPECS.BALL_MAX_SPEED);
        }

        order = inspector.tryMakeOrderKickToRegion(region, 30);
        expect(order?.action.oneofKind).toBe('kick');
        if (order?.action.oneofKind === 'kick') {
            expect(order.action.kick.velocity?.speed).toEqual(30);
        }

        region = new Region(0, 0, Side.HOME, inspector.getBallPosition(), mapper);
        expect(inspector.tryMakeOrderKickToRegion(region)).toBeNull();
    });

    test('DEVE retornar uma ordem de movimentação para um player X ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());
        const me = inspector.getMe();
        const myPosition = me.getPosition();

        let otherPlayer = randomPlayer();
        let order = inspector.tryMakeOrderMoveToPlayer(otherPlayer);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('move');
        if (order?.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity?.direction).toEqual(
                toLugoVector(myPosition.directionTo(otherPlayer.getPosition()))
            );
            expect(order.action.move.velocity?.speed).toEqual(SPECS.PLAYER_MAX_SPEED);
        }

        order = inspector.tryMakeOrderMoveToPlayer(otherPlayer, 30);
        expect(order?.action.oneofKind).toBe('move');
        if (order?.action.oneofKind === 'move') {
            expect(order.action.move.velocity?.speed).toEqual(30);
            otherPlayer = randomPlayer({ position: inspector.getMyPosition() });
            expect(inspector.tryMakeOrderMoveToPlayer(otherPlayer)).toBeNull();
        }
    });

    test('DEVE retornar uma ordem de chute para um player X ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        let otherPlayer = randomPlayer();
        let order = inspector.tryMakeOrderKickToPlayer(otherPlayer);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('kick');
        if (order?.action.oneofKind === 'kick') {
            expect(order.action.kick).toBeTypeOf(typeof Kick);
            expect(order.action.kick.velocity?.direction).toEqual(
                toLugoVector(inspector.getBallPosition().directionTo(otherPlayer.getPosition()))
            );
            expect(order.action.kick.velocity?.speed).toEqual(SPECS.BALL_MAX_SPEED);
        }

        order = inspector.tryMakeOrderKickToPlayer(otherPlayer, 30);
        expect(order?.action.oneofKind).toBe('kick');
        if (order?.action.oneofKind === 'kick') {
            expect(order.action.kick.velocity?.speed).toEqual(30);
            otherPlayer = randomPlayer({ position: inspector.getBallPosition() });
            expect(inspector.tryMakeOrderKickToPlayer(otherPlayer)).toBeNull();
        }
    });

    test('DEVE retornar uma ordem de pulo para um ponto X ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        let point = randomPoint();
        let order = inspector.tryMakeOrderJumpToPoint(point);

        let direction = inspector.getMyPosition().directionTo(point);
        let upOrDown = direction.getY() > 0 ? new Vector2D(0, 1) : new Vector2D(0, -1);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('jump');
        if (order?.action.oneofKind === 'jump') {
            expect(order.action.jump).toBeTypeOf(typeof Jump);
            expect(order.action.jump.velocity?.direction).toEqual(toLugoVector(upOrDown));
            expect(order.action.jump.velocity?.speed).toEqual(SPECS.GOALKEEPER_JUMP_MAX_SPEED);
        }

        expect(inspector.tryMakeOrderJumpToPoint(inspector.getMyPosition())).toBeNull();

        order = inspector.tryMakeOrderJumpToPoint(point, 30);
        expect(order?.action.oneofKind).toBe('jump');
        if (order?.action.oneofKind === 'jump') {
            expect(order.action.jump.velocity?.speed).toEqual(30);
            expect(inspector.tryMakeOrderJumpToPoint(inspector.getMyPosition())).toBeNull();
        }
    });

    test('DEVE retornar uma ordem de movimentação para um ponto X com velocidade 0 ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());
        let point = randomPoint();
        let order = inspector.tryMakeOrderLookAtPoint(point);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('move');
        if (order?.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity).toBeDefined();
            expect(order.action.move.velocity?.direction).toEqual(
                toLugoVector(inspector.getMyPosition().directionTo(point))
            );
            expect(order.action.move.velocity?.speed).toEqual(0);
        }

        expect(inspector.tryMakeOrderLookAtPoint(inspector.getMyPosition())).toBeNull();
    });

    test('DEVE retornar uma ordem de movimentação para uma direção X com velocidade 0 ou null', function () {
        const inspector = fromGameSnapshot(Side.HOME, 11, randomGameSnapshot());

        let direction = Compass.randomDirection();
        let order = inspector.tryMakeOrderLookAtDirection(direction);

        expect(order).toBeTypeOf(typeof Order);
        expect(order?.action.oneofKind).toBe('move');
        if (order?.action.oneofKind === 'move') {
            expect(order.action.move).toBeTypeOf(typeof Move);
            expect(order.action.move.velocity).toBeDefined();
            expect(order.action.move.velocity?.direction).toEqual(toLugoVector(direction));
            expect(order.action.move.velocity?.speed).toEqual(0);
        }

        expect(inspector.tryMakeOrderLookAtDirection(new Vector2D(0, 0))).toBeNull();
    });

    test('DEVE lançar um erro quando tentar pegar um team que não existe', function () {
        const snapshot = new GameSnapshot(ServerState.LISTENING, 0);
        expect(() => fromGameSnapshot(Side.HOME, 11, snapshot)).toThrow(ErrTeamNotFound);
        expect(() => fromGameSnapshot(Side.AWAY, 11, snapshot)).toThrow(ErrTeamNotFound);
    });
});

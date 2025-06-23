import { beforeEach, describe, expect, test } from 'vitest';

import { Formation, Player, Point, ShotClock, Side, Team, Vector2D, Velocity } from '@/core.js';
import { Environment } from '@/core/environment.js';

import { randomPlayer, randomTeam, zeroedBall } from '@/utils.js';

describe('Core/Environment', () => {
    let env: Environment;
    beforeEach(() => {
        env = new Environment();
    });

    test('deve criar uma instância com nome único', () => {
        const env2 = new Environment();
        expect(env.getName()).not.toBe('');
        expect(env.getName()).not.toBe(env2.getName());
    });

    test('set/get turn', () => {
        expect(env.getTurn()).toBeNull();
        env.setTurn(5);
        expect(env.getTurn()).toBe(5);
    });

    test('set/get name', () => {
        env.setName('teste');
        expect(env.getName()).toBe('teste');
    });

    test('set/get ball', () => {
        const ball = zeroedBall();
        env.setBall(ball);
        expect(env.getBall()).toBe(ball);
    });

    test('setBallPosition, setBallVelocity, setBallDirection, setBallSpeed', () => {
        env.setBall(zeroedBall());
        env.setBallPosition(new Point(10, 20));
        expect(env.getBall()?.getPosition().getX()).toBe(10);
        expect(env.getBall()?.getPosition().getY()).toBe(20);
        env.setBallVelocity(new Velocity(new Vector2D(1, 0), 5));
        expect(env.getBall()?.getVelocity().getSpeed()).toBe(5);
        env.setBallDirection(new Vector2D(0, 1));
        expect(env.getBall()?.getVelocity().getDirection().getX()).toBe(0);
        expect(env.getBall()?.getVelocity().getDirection().getY()).toBe(1);
        env.setBallSpeed(7);
        expect(env.getBall()?.getVelocity().getSpeed()).toBe(7);
    });

    test('setBallHolder', () => {
        const player = randomPlayer({ number: 1, side: Side.HOME });
        env.setBall(zeroedBall());
        env.setBallHolder(player);
        expect(env.getBall()?.getHolder()).toBe(player);
        env.setBallHolder(null);
        expect(env.getBall()?.getHolder()).toBeNull();
    });

    test('addPlayer adiciona ao time correto', () => {
        const player = randomPlayer({ number: 2, side: Side.AWAY });
        env.addPlayer(player);
        expect(
            env
                .getAwayTeam()
                ?.getPlayers()
                .some((p) => p === player)
        ).toBe(true);
    });

    test('setHomeTeam e setAwayTeam', () => {
        const home = randomTeam({ side: Side.HOME });
        const away = randomTeam({ side: Side.AWAY });
        env.setHomeTeam(home);
        env.setAwayTeam(away);
        expect(env.getHomeTeam()).toBe(home);
        expect(env.getAwayTeam()).toBe(away);
    });

    test('setHomeScore e setAwayScore', () => {
        env.setHomeScore(3);
        env.setAwayScore(2);
        expect(env.getHomeTeam()?.getScore()).toBe(3);
        expect(env.getAwayTeam()?.getScore()).toBe(2);
    });

    test('getHomePlayer e getAwayPlayer', () => {
        const home = randomTeam({ side: Side.HOME });
        const away = randomTeam({ side: Side.AWAY });
        env.setHomeTeam(home);
        env.setAwayTeam(away);
        expect(env.getHomePlayer(1)).toBe(home.getPlayer(1));
        expect(env.getAwayPlayer(1)).toBe(away.getPlayer(1));
    });

    test('setHomeTeamPositionsByFormation e setAwayTeamPositionsByFormation', () => {
        const formation = new Formation();
        env.setHomeTeamPositionsByFormation(formation);
        env.setAwayTeamPositionsByFormation(formation);
        // Não lança erro e executa método do time
    });

    test('tryGetPlayerByNumberAndSide', () => {
        const player = randomPlayer({ number: 5, side: Side.HOME });
        env.addPlayer(player);
        expect(env.tryGetPlayerByNumberAndSide(5, Side.HOME)).toBeDefined();
        expect(env.tryGetPlayerByNumberAndSide(99, Side.HOME)).toBeNull();
    });

    test('tryGetPlayerByNumberAndSide para Side.AWAY', () => {
        const player = randomPlayer({ number: 7, side: Side.AWAY });
        env.addPlayer(player);
        expect(env.tryGetPlayerByNumberAndSide(7, Side.AWAY)).toBeDefined();
        expect(env.tryGetPlayerByNumberAndSide(99, Side.AWAY)).toBeNull();
    });

    test('getHomePlayers e getAwayPlayers', () => {
        expect(Array.isArray(env.getHomePlayers())).toBe(true);
        expect(Array.isArray(env.getAwayPlayers())).toBe(true);
    });

    test('getShotClock retorna null por padrão', () => {
        expect(env.getShotClock()).toBeNull();
    });

    test('times e bola são nulos por padrão', () => {
        // Por padrão, times e bola são nulos pois significam "manter estado atual"
        expect(env.getHomeTeam()).toBeNull();
        expect(env.getAwayTeam()).toBeNull();
        expect(env.getBall()).toBeNull();
    });

    test('setHomeTeam lança erro se o lado for errado', () => {
        const away = randomTeam({ side: Side.AWAY });
        expect(() => env.setHomeTeam(away)).toThrow();
    });

    test('setAwayTeam lança erro se o lado for errado', () => {
        const home = randomTeam({ side: Side.HOME });
        expect(() => env.setAwayTeam(home)).toThrow();
    });

    test('setHomeTeam não lança erro se o lado for correto', () => {
        const home = randomTeam({ side: Side.HOME });
        expect(() => env.setHomeTeam(home)).not.toThrow();
        expect(env.getHomeTeam()).toBe(home);
    });

    test('setAwayTeam não lança erro se o lado for correto', () => {
        const away = randomTeam({ side: Side.AWAY });
        expect(() => env.setAwayTeam(away)).not.toThrow();
        expect(env.getAwayTeam()).toBe(away);
    });

    test('getBallOrCreate não cria nova bola se já existe', () => {
        const ball = zeroedBall();
        env.setBall(ball);
        // Chamar métodos que usam getBallOrCreate não deve criar nova bola
        env.setBallPosition(new Point(5, 10));
        expect(env.getBall()).toBe(ball); // Mesma instância
        expect(env.getBall()?.getPosition().getX()).toBe(5);
    });
});

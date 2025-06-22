import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { Mapper, Player, Point, SPECS, Side, Vector2D, Velocity } from '@/core.js';

import { randomPlayer, randomPoint, randomVelocity } from '@/utils.js';

describe('Core/Player', () => {
    test('DEVE criar um Player com os atributos corretos', function () {
        const side = Side.HOME;
        const position = new Point(10, 20); // Supondo que Point aceita esses valores
        const initPosition = new Point(5, 10);
        const velocity = new Velocity(new Vector2D(1, 0), 30.0); // Supondo que Velocity e Vector2D aceitam esses valores

        const player = new Player(7, true, side, position, initPosition, velocity);

        expect(player.getNumber()).toBe(7);
        expect(player.getSpeed()).toBe(30.0);
        expect(player.getDirection()).toEqual(new Vector2D(1, 0));
        expect(player.getPosition()).toEqual(position);
        expect(player.getVelocity()).toEqual(velocity);
        expect(player.getTeamSide()).toBe(side);
        expect(player.getInitPosition()).toEqual(initPosition);
        expect(player.getIsJumping()).toBe(true);
    });

    test('DEVE verificar se o jogador é o goleiro com base no número', function () {
        const side = Side.AWAY;
        const position = new Point(10, 20);
        const initPosition = new Point(5, 10);
        const velocity = new Velocity(new Vector2D(1, 0), 30.0);

        const goalkeeper = new Player(SPECS.GOALKEEPER_NUMBER, false, side, position, initPosition, velocity);
        const nonGoalkeeper = new Player(8, false, side, position, initPosition, velocity);

        expect(goalkeeper.isGoalkeeper()).toBe(true);
        expect(nonGoalkeeper.isGoalkeeper()).toBe(false);
    });

    test('DEVE verificar a igualdade entre jogadores', function () {
        const side = Side.HOME;
        const position = new Point(10, 20);
        const initPosition = new Point(5, 10);
        const velocity = new Velocity(new Vector2D(1, 0), 30.0);

        const player1 = new Player(7, true, side, position, initPosition, velocity);
        const player2 = new Player(7, true, side, position, initPosition, velocity);
        const player3 = new Player(8, true, side, position, initPosition, velocity);

        expect(player1.eq(player2)).toBe(true);
        expect(player1.is(player2)).toBe(true);
        expect(player1.eq(player3)).toBe(false);
        expect(player1.is(player3)).toBe(false);
    });

    test('DEVE retornar corretamente se está no campo de defesa ou ataque', function () {
        let side = Side.HOME;
        let position = new Point(10, 20);
        let player = new Player(7, true, side, position, randomPoint(), randomVelocity());
        expect(player.isInAttackSide()).toBe(false);
        expect(player.isInDefenseSide()).toBe(true);

        side = Side.AWAY;
        position = new Point(10, 20);
        player = new Player(7, true, side, position, randomPoint(), randomVelocity());
        expect(player.isInAttackSide()).toBe(true);
        expect(player.isInDefenseSide()).toBe(false);
    });

    test('DEVE retornar a direção e distancia para um player', function () {
        const side = Side.HOME;
        const position = new Point(10, 20);
        const player = new Player(7, true, side, position, randomPoint(), randomVelocity());
        const player2 = randomPlayer();

        const direction = player.directionToPlayer(player2);
        const distance = player.distanceToPlayer(player2);

        expect(direction).toEqual(player.getPosition().directionTo(player2.getPosition()));
        expect(distance).toEqual(player.getPosition().distanceTo(player2.getPosition()));
    });

    test('DEVE retornar a direção e distancia para um ponto', function () {
        const side = Side.HOME;
        const position = new Point(10, 20);
        const player = new Player(7, true, side, position, randomPoint(), randomVelocity());
        const point = randomPoint();

        const direction = player.directionToPoint(point);
        const distance = player.distanceToPoint(point);

        expect(direction).toEqual(player.getPosition().directionTo(point));
        expect(distance).toEqual(player.getPosition().distanceTo(point));
    });

    test('DEVE retornar a direção e distancia para uma região', function () {
        const side = Side.HOME;
        const position = new Point(10, 20);
        const player = new Player(7, true, side, position, randomPoint(), randomVelocity());
        const mapper = new Mapper(10, 10, Side.HOME);
        const region = mapper.getRandomRegion();

        const direction = player.directionToRegion(region);
        const distance = player.distanceToRegion(region);

        expect(direction).toEqual(player.getPosition().directionTo(region.getCenter()));
        expect(distance).toEqual(player.getPosition().distanceTo(region.getCenter()));
    });
});

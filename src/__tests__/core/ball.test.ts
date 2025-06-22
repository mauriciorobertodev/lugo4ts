import { beforeEach, describe, expect, test } from 'vitest';

import { Ball, Mapper, Player, Point, SPECS, Side, Vector2D, Velocity } from '@/core.js';

import { randomBall, randomPlayer, randomPoint, zeroedBall } from '@/utils.js';

let position: Point;
let velocity: Velocity;
let holder: Player;
let ball: Ball;

describe('Core/Ball', () => {
    beforeEach(() => {
        position = new Point(10, 20);
        velocity = new Velocity(new Vector2D(1, 0), 5);
        holder = new Player(1, false, Side.HOME, position, position, velocity);
        ball = new Ball(position, velocity, holder);
    });

    test('DEVE ser construído com valores corretos', () => {
        expect(ball.getPosition()).toBeInstanceOf(Point);
        expect(ball.getVelocity()).toBeInstanceOf(Velocity);
        expect(ball.getHolder()).toBeInstanceOf(Player);
    });

    test('DEVE retornar a posição', () => {
        const newPosition = new Point(15, 25);
        ball.setPosition(newPosition);
        expect(ball.getPosition()).toBe(newPosition);
    });

    test('DEVE retornar a Velocity', () => {
        const newVelocity = new Velocity(new Vector2D(0, 1), 10);
        ball.setVelocity(newVelocity);
        expect(ball.getVelocity()).toBe(newVelocity);
    });

    test('DEVE retornar a direção e velocidade', () => {
        expect(ball.getDirection()).toBeInstanceOf(Vector2D);
        expect(ball.getSpeed()).toBe(5.0);
    });

    test('DEVE retornar se existe um holder', () => {
        expect(ball.hasHolder()).toBe(true);

        const ballWithoutHolder = new Ball(position, velocity, null);
        expect(ballWithoutHolder.hasHolder()).toBe(false);
    });

    test('DEVE retornar e o holder é o player X', () => {
        const anotherPlayer = new Player(2, false, Side.AWAY, position, position, velocity);

        expect(ball.holderIs(holder)).toBe(true);
        expect(ball.holderIs(anotherPlayer)).toBe(false);
    });

    test('DEVE retornar o holder', () => {
        expect(ball.getHolder()).toBe(holder);
    });

    test('DEVE retornar a direção e distancia para um player', () => {
        const player2 = randomPlayer();
        const ball = randomBall();

        const direction = ball.directionToPlayer(player2);
        const distance = ball.distanceToPlayer(player2);

        expect(direction).toEqual(ball.getPosition().directionTo(player2.getPosition()));
        expect(distance).toEqual(ball.getPosition().distanceTo(player2.getPosition()));
    });

    test('DEVE retornar a direção e distancia para um ponto', () => {
        const point = randomPoint();
        const ball = randomBall();

        const direction = ball.directionToPoint(point);
        const distance = ball.distanceToPoint(point);

        expect(direction).toEqual(ball.getPosition().directionTo(point));
        expect(distance).toEqual(ball.getPosition().distanceTo(point));
    });

    test('DEVE retornar a direção e distancia para uma região', () => {
        const mapper = new Mapper(10, 10, Side.HOME);
        const region = mapper.getRandomRegion();
        const ball = randomBall();

        const direction = ball.directionToRegion(region);
        const distance = ball.distanceToRegion(region);

        expect(direction).toEqual(ball.getPosition().directionTo(region.getCenter()));
        expect(distance).toEqual(ball.getPosition().distanceTo(region.getCenter()));
    });

    test('DEVE criar uma bola no posição no centro do campo e velocity zerada', () => {
        const ball = zeroedBall();

        expect(ball.getPosition()).toEqual(new Point(SPECS.FIELD_CENTER_X, SPECS.FIELD_CENTER_Y));
        expect(ball.getDirection()).toEqual(new Vector2D(0, 0));
        expect(ball.getSpeed()).toEqual(0);
    });
});

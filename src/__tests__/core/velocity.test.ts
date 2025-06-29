import { Vector2D, Velocity, zeroedVelocity } from '@/index.js';
import { describe, expect, test } from 'vitest';

describe('Core/Velocity', () => {
    test('DEVE retornar uma velocity zerada', function () {
        const velocity = zeroedVelocity();

        expect(velocity.getDirection().is(new Vector2D(0, 0))).toBe(true);
    });

    test('DEVE retornar direção e velocidade ao ser usado em uma string', function () {
        const velocity = new Velocity(new Vector2D(555.5, 666.6), 222);
        const string = velocity.toString();

        expect(string).toBe('[555.5, 666.6, 222]');
    });

    test('DEVE definir a direção e velocidade', function () {
        const velocity = zeroedVelocity();

        expect(velocity.getDirection()).toEqual(new Vector2D(0, 0));
        expect(velocity.getSpeed()).toEqual(0);

        velocity.setSpeed(888.8);
        velocity.setDirection(new Vector2D(111.1, 222.2));
        expect(velocity.getDirection()).toEqual(new Vector2D(111.1, 222.2));
        expect(velocity.getSpeed()).toEqual(888.8);
    });
});

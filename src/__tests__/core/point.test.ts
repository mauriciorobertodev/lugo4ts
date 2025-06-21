import { describe, expect, test } from 'vitest';

import { Point, Vector2D } from '@/core.js';

import { pointToVector2D } from '@/utils.js';

describe('Core/Point', () => {
    test('DEVE definir, adicionar, subtrair, escalar e dividir o eixo X', () => {
        const pos = new Point(0, 0);
        expect(pos.getX()).toBe(0);

        pos.setX(10);
        expect(pos.getX()).toBe(10);

        pos.addX(24);
        expect(pos.getX()).toBe(34);

        pos.subtractX(2);
        expect(pos.getX()).toBe(32);

        pos.scaleX(2);
        expect(pos.getX()).toBe(64);

        pos.divideX(8);
        expect(pos.getX()).toBe(8);
    });

    test('DEVE definir, adicionar, subtrair, escalar e dividir o eixo Y', () => {
        const pos = new Point(0, 0);
        expect(pos.getY()).toBe(0);

        pos.setY(10);
        expect(pos.getY()).toBe(10);

        pos.addY(24);
        expect(pos.getY()).toBe(34);

        pos.subtractY(2);
        expect(pos.getY()).toBe(32);

        pos.scaleY(2);
        expect(pos.getY()).toBe(64);

        pos.divideY(8);
        expect(pos.getY()).toBe(8);
    });

    test('DEVE adicionar, subtrair, escalar e dividir em ambos os eixos, usando um outro Point', () => {
        const pos = new Point(0, 0);
        expect(pos.getX()).toBe(0);
        expect(pos.getY()).toBe(0);

        let result = pos.add(new Point(34, 64));
        expect(result.getX()).toBe(34);
        expect(result.getY()).toBe(64);
        expect(pos).toBe(result);

        result = pos.subtract(new Point(2, 32));
        expect(result.getX()).toBe(32);
        expect(result.getY()).toBe(32);
        expect(pos).toBe(result);

        result = pos.scale(new Point(2, 4));
        expect(result.getX()).toBe(64);
        expect(result.getY()).toBe(128);
        expect(pos).toBe(result);

        result = pos.divide(new Point(8, 16));
        expect(result.getX()).toBe(8);
        expect(result.getY()).toBe(8);
        expect(pos).toBe(result);
    });

    test('DEVE retornar um clone adicionado, subtraído, escalonado e dividido em ambos os eixos, usando um outro Point', () => {
        const pos = new Point(3, 4);
        expect(pos.getX()).toBe(3);
        expect(pos.getY()).toBe(4);

        let result = pos.added(new Point(34, 64));
        expect(result.getX()).toBe(37);
        expect(result.getY()).toBe(68);
        expect(pos).not.toBe(result);

        result = pos.subtracted(new Point(2, 32));
        expect(result.getX()).toBe(1);
        expect(result.getY()).toBe(-28);
        expect(pos).not.toBe(result);

        result = pos.scaled(new Point(2, 4));
        expect(result.getX()).toBe(6);
        expect(result.getY()).toBe(16);
        expect(pos).not.toBe(result);

        result = pos.divided(new Point(8, 16));
        expect(result.getX()).toBeCloseTo(0.375);
        expect(result.getY()).toBeCloseTo(0.25);
        expect(pos).not.toBe(result);
    });

    test('DEVE adicionar, subtrair, escalar e dividir em ambos os eixos, usando um valor', () => {
        const pos = new Point(0, 0);
        expect(pos.getX()).toBe(0);
        expect(pos.getY()).toBe(0);

        pos.add(34);
        expect(pos.getX()).toBe(34);
        expect(pos.getY()).toBe(34);

        pos.subtract(2);
        expect(pos.getX()).toBe(32);
        expect(pos.getY()).toBe(32);

        pos.scale(2);
        expect(pos.getX()).toBe(64);
        expect(pos.getY()).toBe(64);

        pos.divide(8);
        expect(pos.getX()).toBe(8);
        expect(pos.getY()).toBe(8);
    });

    test('DEVE retornar um clone da classe', () => {
        const pos = new Point(0, 0);
        const cloned = pos.clone();

        expect(cloned).not.toBe(pos);
        expect(cloned).toEqual(pos);

        cloned.setX(500);
        expect(cloned).not.toEqual(pos);
    });

    test.each([
        [3, 4, 5.0],
        [-3, -4, 5.0],
        [0, 0, 0.0],
        [5, 12, 13.0],
        [-8, 15, 17.0],
        [7, -24, 25.0],
    ])('DEVE retornar a magnitude para (%i, %i)', (x, y, expected) => {
        const pos = new Point(x, y);
        expect(pos.magnitude()).toBeCloseTo(expected);
    });

    test.each([
        [0, 0, 3, 4, 0.6, 0.8],
        [1, 1, 4, 5, 0.6, 0.8],
        [0, 0, -3, -4, -0.6, -0.8],
        [2, 2, 2, 5, 0.0, 1.0],
        [5, 5, 5, 5, 0.0, 0.0],
    ])('DEVE retornar a direção correta', (sx, sy, ex, ey, expectedX, expectedY) => {
        const start = new Point(sx, sy);
        const end = new Point(ex, ey);
        const direction = start.directionTo(end);

        expect(direction.getX()).toBeCloseTo(expectedX);
        expect(direction.getY()).toBeCloseTo(expectedY);
    });

    test.each([
        [0, 0, 3, 4, 5.0],
        [1, 1, 4, 5, 5.0],
        [0, 0, -3, -4, 5.0],
        [2, 2, 2, 5, 3.0],
        [5, 5, 5, 5, 0.0],
        [1, 1, 1, 1, 0.0],
    ])('DEVE retornar a distância correta', (sx, sy, ex, ey, expected) => {
        const start = new Point(sx, sy);
        const end = new Point(ex, ey);
        expect(start.distanceTo(end)).toBeCloseTo(expected);
    });

    test.each([
        [0, 0, 1, 0, 5, 5, 0],
        [0, 0, 0, 1, 3, 0, 3],
        [0, 0, -1, 0, 4, -4, 0],
        [0, 0, 0, -1, 2, 0, -2],
        [1, 1, 0.6, 0.8, 5, 4, 5],
        [1, 1, 0.6, -0.8, 5, 4, -3],
    ])('DEVE mover corretamente na direção dada', (sx, sy, dirX, dirY, distance, ex, ey) => {
        const start = new Point(sx, sy);
        const direction = new Vector2D(dirX, dirY);
        const moved = start.moveToDirection(direction, distance);

        expect(moved.getX()).toBeCloseTo(ex);
        expect(moved.getY()).toBeCloseTo(ey);
        expect(moved).toBe(start);
    });

    test.each([
        [0, 0, 1, 0, 5, 5, 0],
        [0, 0, 0, 1, 3, 0, 3],
        [0, 0, -1, 0, 4, -4, 0],
        [0, 0, 0, -1, 2, 0, -2],
        [1, 1, 0.6, 0.8, 5, 4, 5],
        [1, 1, 0.6, -0.8, 5, 4, -3],
    ])('DEVE retornar um clone movido corretamente na direção dada', (sx, sy, dirX, dirY, distance, ex, ey) => {
        const start = new Point(sx, sy);
        const direction = new Vector2D(dirX, dirY);
        const moved = start.movedToDirection(direction, distance);

        expect(moved.getX()).toBeCloseTo(ex);
        expect(moved.getY()).toBeCloseTo(ey);
        expect(moved).not.toBe(start);
    });

    test.each([
        [0, 0, 3, 4, 5, 3, 4],
        [1, 1, 4, 5, 3, 2.8, 3.4],
        [0, 0, -3, -4, 5, -3, -4],
        [2, 2, 2, 5, 3, 2, 5],
        [5, 5, 0, 0, 5, 1.464466094, 1.464466094],
    ])('DEVE mover corretamente para o ponto', (sx, sy, px, py, distance, ex, ey) => {
        const start = new Point(sx, sy);
        const point = new Point(px, py);
        const moved = start.moveToPoint(point, distance);

        expect(moved.getX()).toBeCloseTo(ex);
        expect(moved.getY()).toBeCloseTo(ey);
        expect(moved).toBe(start);
    });

    test.each([
        [0, 0, 3, 4, 5, 3, 4],
        [1, 1, 4, 5, 3, 2.8, 3.4],
        [0, 0, -3, -4, 5, -3, -4],
        [2, 2, 2, 5, 3, 2, 5],
        [5, 5, 0, 0, 5, 1.464466094, 1.464466094],
    ])('DEVE retornar um clone movido corretamente para o ponto', (sx, sy, px, py, distance, ex, ey) => {
        const start = new Point(sx, sy);
        const point = new Point(px, py);
        const moved = start.movedToPoint(point, distance);

        expect(moved.getX()).toBeCloseTo(ex);
        expect(moved.getY()).toBeCloseTo(ey);
        expect(moved).not.toBe(start);
    });

    test('DEVE ser convertido para uma string', () => {
        const pos = new Point(500, 200);
        const string = `${pos}`;
        expect(string).toBe('(500.00, 200.00)');
    });

    test('DEVE retornar um clone em Point ou Vector', () => {
        const p = new Point(555, 222);
        expect(p).toBeInstanceOf(Point);
        expect(p.getX()).toBe(555);
        expect(p.getY()).toBe(222);

        const v = pointToVector2D(p);
        expect(v).toBeInstanceOf(Vector2D);
        expect(v.getX()).toBe(555);
        expect(v.getY()).toBe(222);
    });

    test('DEVE verificar se dois Positionables têm o mesmo X e Y', () => {
        const pos = new Point(555, 222);
        const p1 = new Point(555, 222);
        const v1 = new Vector2D(555, 222);
        const p2 = new Point(333, 333);
        const v2 = new Vector2D(333, 333);

        expect(pos.is(p1)).toBe(true);
        expect(pos.is(v1)).toBe(true);
        expect(pos.eq(p1)).toBe(true);
        expect(pos.eq(v1)).toBe(true);

        expect(pos.is(p2)).toBe(false);
        expect(pos.is(v2)).toBe(false);
        expect(pos.eq(p2)).toBe(false);
        expect(pos.eq(v2)).toBe(false);
    });
});

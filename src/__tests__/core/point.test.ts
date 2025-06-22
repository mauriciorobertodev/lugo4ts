import { describe, expect, test } from 'vitest';

import { Vector2D } from '@/core.js';
import { Point } from '@/core/point.js';

describe('Core/Point', () => {
    test('DEVE definir, adicionar, subtrair, escalar e dividir o eixo X', () => {
        const pos = new Point(0, 0);
        expect(pos.getX()).toEqual(0);

        pos.setX(10);
        expect(pos.getX()).toEqual(10);

        pos.addX(24);
        expect(pos.getX()).toEqual(34);

        pos.subtractX(2);
        expect(pos.getX()).toEqual(32);

        pos.scaleX(2);
        expect(pos.getX()).toEqual(64);

        pos.divideX(8);
        expect(pos.getX()).toEqual(8);
    });

    test('DEVE definir, adicionar, subtrair, escalar e dividir o eixo Y', () => {
        const pos = new Point(0, 0);
        expect(pos.getY()).toEqual(0);

        pos.setY(10);
        expect(pos.getY()).toEqual(10);

        pos.addY(24);
        expect(pos.getY()).toEqual(34);

        pos.subtractY(2);
        expect(pos.getY()).toEqual(32);

        pos.scaleY(2);
        expect(pos.getY()).toEqual(64);

        pos.divideY(8);
        expect(pos.getY()).toEqual(8);
    });

    test('DEVE adicionar, subtrair, escalar e dividir em ambos os eixos, usando um outro Positionable', () => {
        const pos = new Point(0, 0);
        expect(pos.getX()).toEqual(0);
        expect(pos.getY()).toEqual(0);

        let result = pos.add(new Point(34, 64));
        expect(result.getX()).toEqual(34);
        expect(result.getY()).toEqual(64);
        expect(pos).toBe(result);

        result = pos.subtract(new Point(2, 32));
        expect(result.getX()).toEqual(32);
        expect(result.getY()).toEqual(32);
        expect(pos).toBe(result);

        result = pos.scale(new Point(2, 4));
        expect(result.getX()).toEqual(64);
        expect(result.getY()).toEqual(128);
        expect(pos).toBe(result);

        result = pos.divide(new Point(8, 16));
        expect(result.getX()).toEqual(8);
        expect(result.getY()).toEqual(8);
        expect(pos).toBe(result);
    });

    test('DEVE retornar um clone adicionado, subtraído, escalonado, normalizado e dividido em ambos os eixos, usando um outro Positionable', () => {
        const pos = new Point(3, 4);
        expect(pos.getX()).toEqual(3);
        expect(pos.getY()).toEqual(4);

        let result = pos.added(new Point(34, 64));
        expect(result.getX()).toEqual(37);
        expect(result.getY()).toEqual(68);
        expect(pos).not.toBe(result);

        result = pos.subtracted(new Point(2, 32));
        expect(result.getX()).toEqual(1);
        expect(result.getY()).toEqual(-28);
        expect(pos).not.toBe(result);

        result = pos.scaled(new Point(2, 4));
        expect(result.getX()).toEqual(6);
        expect(result.getY()).toEqual(16);
        expect(pos).not.toBe(result);

        result = pos.normalized();
        expect(result.getX()).toBeCloseTo(0.6);
        expect(result.getY()).toBeCloseTo(0.8);
        expect(pos).not.toBe(result);

        result = pos.divided(new Point(8, 16));
        expect(result.getX()).toEqual(0.375);
        expect(result.getY()).toEqual(0.25);
        expect(pos).not.toBe(result);
    });

    test('DEVE adicionar, subtrair, escalar e dividir em ambos os eixos, usando um valor', () => {
        const pos = new Point(0, 0);
        expect(pos.getX()).toEqual(0);
        expect(pos.getY()).toEqual(0);

        pos.add(34);
        expect(pos.getX()).toEqual(34);
        expect(pos.getY()).toEqual(34);

        pos.subtract(2);
        expect(pos.getX()).toEqual(32);
        expect(pos.getY()).toEqual(32);

        pos.scale(2);
        expect(pos.getX()).toEqual(64);
        expect(pos.getY()).toEqual(64);

        pos.divide(8);
        expect(pos.getX()).toEqual(8);
        expect(pos.getY()).toEqual(8);
    });

    test('DEVE retornar um clone da classe', function () {
        const pos = new Point(0, 0);
        expect(pos).toBe(pos);

        const cloned = pos.clone();
        expect(pos).not.toBe(cloned);
        expect(pos).toEqual(cloned);

        cloned.setX(500);
        expect(pos).not.toEqual(cloned);
    });

    test.each([
        [3, 4, 5.0],
        [-3, -4, 5.0],
        [0, 0, 0.0],
        [5, 12, 13.0],
        [-8, 15, 17.0],
        [7, -24, 25.0],
    ])('DEVE retornar a magnitude: (%d, %d) → %f', (x, y, expected) => {
        const pos = new Point(x, y);
        expect(pos.magnitude()).toBeCloseTo(expected);
    });

    test.each([
        [0, 0, 3, 4, 0.6, 0.8],
        [1, 1, 4, 5, 0.6, 0.8],
        [0, 0, -3, -4, -0.6, -0.8],
        [2, 2, 2, 5, 0.0, 1.0],
        [5, 5, 5, 5, 0.0, 0.0],
    ])('DEVE retornar a direção correta', (sx, sy, ex, ey, dx, dy) => {
        const start = new Point(sx, sy);
        const end = new Point(ex, ey);
        const dir = start.directionTo(end);
        expect(dir.getX()).toBeCloseTo(dx);
        expect(dir.getY()).toBeCloseTo(dy);
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
    ])('DEVE mover corretamente na direção dada', (sx, sy, dx, dy, dist, ex, ey) => {
        const start = new Point(sx, sy);
        const dir = new Vector2D(dx, dy);
        const moved = start.moveToDirection(dir, dist);
        expect(moved.getX()).toBeCloseTo(ex);
        expect(moved.getY()).toBeCloseTo(ey);
        expect(moved).toBe(start); // mesma instância
    });

    test.each([
        [0, 0, 1, 0, 5, 5, 0],
        [0, 0, 0, 1, 3, 0, 3],
        [0, 0, -1, 0, 4, -4, 0],
        [0, 0, 0, -1, 2, 0, -2],
        [1, 1, 0.6, 0.8, 5, 4, 5],
        [1, 1, 0.6, -0.8, 5, 4, -3],
    ])('DEVE retornar um clone movido corretamente na direção dada', (sx, sy, dx, dy, dist, ex, ey) => {
        const start = new Point(sx, sy);
        const dir = new Vector2D(dx, dy);
        const moved = start.movedToDirection(dir, dist);
        expect(moved.getX()).toBeCloseTo(ex);
        expect(moved.getY()).toBeCloseTo(ey);
        expect(moved).not.toBe(start); // clone diferente
    });

    test.each([
        [0, 0, 3, 4, 5, 3, 4],
        [1, 1, 4, 5, 3, 2.8, 3.4],
        [0, 0, -3, -4, 5, -3, -4],
        [2, 2, 2, 5, 3, 2, 5],
        [5, 5, 0, 0, 5, 1.464466094, 1.464466094],
    ])('DEVE mover corretamente para o ponto', (sx, sy, px, py, dist, ex, ey) => {
        const start = new Point(sx, sy);
        const point = new Point(px, py);
        const moved = start.moveToPoint(point, dist);
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
    ])('DEVE retornar um clone movido corretamente para o ponto', (sx, sy, px, py, dist, ex, ey) => {
        const start = new Point(sx, sy);
        const point = new Point(px, py);
        const moved = start.movedToPoint(point, dist);
        expect(moved.getX()).toBeCloseTo(ex);
        expect(moved.getY()).toBeCloseTo(ey);
        expect(moved).not.toBe(start);
    });

    test('DEVE ser convertido para uma string', () => {
        const p = new Point(500, 200);
        expect(`${p}`).toBe('(500.00, 200.00)');
    });

    test('DEVE verificar igualdade com outro positionable', () => {
        const p = new Point(555, 222);
        const p1 = new Point(555, 222);
        const p2 = new Point(333, 333);

        expect(p.eq(p1)).toBe(true);
        expect(p.is(p1)).toBe(true);
        expect(p.eq(p2)).toBe(false);
        expect(p.is(p2)).toBe(false);
    });
});

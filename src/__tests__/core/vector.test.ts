import { Point, Vector2D } from '@/index.js';
import { describe, expect, test } from 'vitest';

describe('Core/Vector', () => {
    test('DEVE definir, adicionar, subtrair, escalar e dividir o eixo X', () => {
        const vec = new Vector2D(0, 0);
        expect(vec.getX()).toEqual(0);

        vec.setX(10);
        expect(vec.getX()).toEqual(10);

        vec.addX(24);
        expect(vec.getX()).toEqual(34);

        vec.subtractX(2);
        expect(vec.getX()).toEqual(32);

        vec.scaleX(2);
        expect(vec.getX()).toEqual(64);

        vec.divideX(8);
        expect(vec.getX()).toEqual(8);
    });

    test('DEVE definir, adicionar, subtrair, escalar e dividir o eixo Y', () => {
        const vec = new Vector2D(0, 0);
        expect(vec.getY()).toEqual(0);

        vec.setY(10);
        expect(vec.getY()).toEqual(10);

        vec.addY(24);
        expect(vec.getY()).toEqual(34);

        vec.subtractY(2);
        expect(vec.getY()).toEqual(32);

        vec.scaleY(2);
        expect(vec.getY()).toEqual(64);

        vec.divideY(8);
        expect(vec.getY()).toEqual(8);
    });

    test('DEVE adicionar, subtrair, escalar e dividir em ambos os eixos, usando um outro Positionable', () => {
        const vec = new Vector2D(0, 0);
        expect(vec.getX()).toEqual(0);
        expect(vec.getY()).toEqual(0);

        let result = vec.add(new Point(34, 64));
        expect(result.getX()).toEqual(34);
        expect(result.getY()).toEqual(64);
        expect(vec).toBe(result);

        result = vec.subtract(new Point(2, 32));
        expect(result.getX()).toEqual(32);
        expect(result.getY()).toEqual(32);
        expect(vec).toBe(result);

        result = vec.scale(new Point(2, 4));
        expect(result.getX()).toEqual(64);
        expect(result.getY()).toEqual(128);
        expect(vec).toBe(result);

        result = vec.divide(new Point(8, 16));
        expect(result.getX()).toEqual(8);
        expect(result.getY()).toEqual(8);
        expect(vec).toBe(result);
    });

    test('DEVE retornar um clone adicionado, subtraído, escalonado e dividido em ambos os eixos, usando um outro Positionable', () => {
        const vec = new Vector2D(3, 4);
        expect(vec.getX()).toEqual(3);
        expect(vec.getY()).toEqual(4);

        let result = vec.added(new Point(34, 64));
        expect(result.getX()).toEqual(37);
        expect(result.getY()).toEqual(68);
        expect(vec).not.toBe(result);

        result = vec.subtracted(new Point(2, 32));
        expect(result.getX()).toEqual(1);
        expect(result.getY()).toEqual(-28);
        expect(vec).not.toBe(result);

        result = vec.scaled(new Point(2, 4));
        expect(result.getX()).toEqual(6);
        expect(result.getY()).toEqual(16);
        expect(vec).not.toBe(result);

        result = vec.divided(new Point(8, 16));
        expect(result.getX()).toEqual(0.375);
        expect(result.getY()).toEqual(0.25);
        expect(vec).not.toBe(result);
    });

    test('DEVE adicionar, subtrair, escalar e dividir em ambos os eixos, usando um valor', () => {
        const vec = new Vector2D(0, 0);
        expect(vec.getX()).toEqual(0);
        expect(vec.getY()).toEqual(0);

        vec.add(34);
        expect(vec.getX()).toEqual(34);
        expect(vec.getY()).toEqual(34);

        vec.subtract(2);
        expect(vec.getX()).toEqual(32);
        expect(vec.getY()).toEqual(32);

        vec.scale(2);
        expect(vec.getX()).toEqual(64);
        expect(vec.getY()).toEqual(64);

        vec.divide(8);
        expect(vec.getX()).toEqual(8);
        expect(vec.getY()).toEqual(8);
    });

    test('DEVE retornar um clone da classe', function () {
        const vec = new Vector2D(0, 0);
        expect(vec).toBe(vec);

        const cloned = vec.clone();
        expect(vec).not.toBe(cloned);
        expect(vec).toEqual(cloned);

        cloned.setX(500);
        expect(vec).not.toEqual(cloned);
    });

    test.each([
        [3, 4, 5.0],
        [-3, -4, 5.0],
        [0, 0, 0.0],
        [5, 12, 13.0],
        [-8, 15, 17.0],
        [7, -24, 25.0],
    ])('DEVE retornar a magnitude: (%d, %d) → %f', (x, y, expected) => {
        const vec = new Vector2D(x, y);
        expect(vec.magnitude()).toBeCloseTo(expected);
    });

    test('DEVE ser convertido para uma string', () => {
        const vec = new Vector2D(500, 200);
        expect(`${vec}`).toBe('(500.0000000000, 200.0000000000)');
    });

    test('DEVE verificar igualdade com outro positionable', () => {
        const v = new Vector2D(555, 222);
        const v1 = new Vector2D(555, 222);
        const v2 = new Vector2D(333, 333);

        expect(v.eq(v1)).toBe(true);
        expect(v.is(v1)).toBe(true);
        expect(v.eq(v2)).toBe(false);
        expect(v.is(v2)).toBe(false);
    });
});

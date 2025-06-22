import { describe, expect, test } from 'vitest';

import { randomElement, randomFloat, randomInt, zeroedPoint } from '@/utils.js';

describe('Utils/Random', () => {
    test('DEVE gerar um número aleatório entre dois valores', () => {
        const min = 1;
        const max = 10;
        const random = randomInt(min, max);
        expect(random).toBeGreaterThanOrEqual(min);
        expect(random).toBeLessThanOrEqual(max);
    });

    test('DEVE gerar um número aleatório de ponto flutuante entre dois valores', () => {
        const min = 1;
        const max = 10;
        const random = randomFloat(min, max);
        expect(random).toBeGreaterThanOrEqual(min);
        expect(random).toBeLessThanOrEqual(max);
    });

    test('DEVE selecionar um elemento aleatório de um array', () => {
        const array = [1, 2, 3, 4, 5];
        const random = randomElement(array);
        expect(array).toContain(random);
    });

    test('DEVE lançar erro ao tentar selecionar um elemento de um array vazio', () => {
        const emptyArray: number[] = [];
        expect(() => randomElement(emptyArray)).toThrowError('Array cannot be empty');
    });
});

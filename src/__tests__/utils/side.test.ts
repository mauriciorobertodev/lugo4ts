import { describe, expect, test } from 'vitest';

import { Side } from '@/core.js';

import { flipSide, intToSide, randomSide, sideToInt, stringToSide } from '@/utils/side.js';

describe('Utils/Side', () => {
    describe('Conversores', () => {
        test('DEVE converter inteiro para Side', () => {
            expect(intToSide(0)).toBe(Side.HOME);
            expect(intToSide(1)).toBe(Side.AWAY);
        });

        test('DEVE converter string para Side', () => {
            expect(stringToSide('home')).toBe(Side.HOME);
            expect(stringToSide('HOME')).toBe(Side.HOME);
            expect(stringToSide('away')).toBe(Side.AWAY);
            expect(stringToSide('AWAY')).toBe(Side.AWAY);
            expect(() => stringToSide('invalid')).toThrow();
        });

        test('DEVE converter Side para inteiro', () => {
            expect(sideToInt(Side.HOME)).toBe(0);
            expect(sideToInt(Side.AWAY)).toBe(1);
        });
    });

    describe('Utilitários', () => {
        test('DEVE inverter o Side', () => {
            expect(flipSide(Side.HOME)).toBe(Side.AWAY);
            expect(flipSide(Side.AWAY)).toBe(Side.HOME);
        });

        test('DEVE sortear um Side aleatório', () => {
            // Executa várias vezes para garantir que ambos os lados aparecem
            let home = false,
                away = false;
            for (let i = 0; i < 100; i++) {
                const s = randomSide();
                expect([Side.HOME, Side.AWAY]).toContain(s);
                if (s === Side.HOME) home = true;
                if (s === Side.AWAY) away = true;
            }
            expect(home).toBe(true);
            expect(away).toBe(true);
        });
    });
});

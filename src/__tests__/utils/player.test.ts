import {
    Player,
    PlayerState,
    SPECS,
    Side,
    isValidPlayerNumber,
    randomPlayer,
    randomPlayerState,
    zeroedPlayer,
} from '@/index.js';
import { describe, expect, test } from 'vitest';

describe('Utils/Player', () => {
    describe('Factories', () => {
        test('DEVE criar um jogador zerado', () => {
            const p = zeroedPlayer();
            expect(p).toBeInstanceOf(Player);
            expect(p.getNumber()).toBe(0);
            expect(p.getIsJumping()).toBe(false);
            expect(p.getTeamSide()).toBe(Side.HOME);
            expect(p.getPosition().getX()).toBe(0);
            expect(p.getPosition().getY()).toBe(0);
            expect(p.getVelocity().getSpeed()).toBe(0);
        });

        test('DEVE criar um jogador aleatório válido', () => {
            for (let i = 0; i < 50; i++) {
                const p = randomPlayer();
                expect(p).toBeInstanceOf(Player);
                expect(isValidPlayerNumber(p.getNumber())).toBe(true);
                expect([Side.HOME, Side.AWAY]).toContain(p.getTeamSide());
                expect(typeof p.getIsJumping()).toBe('boolean');
                expect(p.getVelocity().getSpeed()).toBeGreaterThanOrEqual(0);
                expect(p.getVelocity().getSpeed()).toBeLessThanOrEqual(SPECS.PLAYER_MAX_SPEED);
            }
        });

        test('DEVE criar um jogador com parâmetros definidos', () => {
            const p = randomPlayer({ number: 7, side: Side.AWAY, isJumping: true });
            expect(p.getNumber()).toBe(7);
            expect(p.getTeamSide()).toBe(Side.AWAY);
            expect(p.getIsJumping()).toBe(true);
        });

        test('DEVE sortear um estado de jogador válido', () => {
            for (let i = 0; i < 20; i++) {
                const state = randomPlayerState();
                expect([
                    PlayerState.HOLDING,
                    PlayerState.DEFENDING,
                    PlayerState.DISPUTING,
                    PlayerState.SUPPORTING,
                ]).toContain(state);
            }
        });
    });

    describe('Validators', () => {
        test('DEVE validar números de jogador válidos e inválidos', () => {
            expect(isValidPlayerNumber(1)).toBe(true);
            expect(isValidPlayerNumber(SPECS.MAX_PLAYERS)).toBe(true);
            expect(isValidPlayerNumber(0)).toBe(false);
            expect(isValidPlayerNumber(SPECS.MAX_PLAYERS + 1)).toBe(false);
        });
    });
});

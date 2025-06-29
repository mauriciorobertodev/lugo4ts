import { Ball, GameSnapshot, ServerState, Side, Team } from '@/index.js';
import { describe, expect, test } from 'vitest';

import { createZeroedSnapshot, randomGameSnapshot } from '@/utils/game-snapshot.js';

describe('Utils/GameSnapshot', () => {
    describe('Factories', () => {
        test('DEVE criar um snapshot zerado', () => {
            const snap = createZeroedSnapshot();
            expect(snap).toBeInstanceOf(GameSnapshot);
            expect(snap.getState()).toBe(ServerState.WAITING);
            expect(snap.getTurn()).toBe(0);
        });

        test('DEVE criar um snapshot aleatório válido', () => {
            for (let i = 0; i < 10; i++) {
                const snap = randomGameSnapshot();
                expect(snap).toBeInstanceOf(GameSnapshot);
                expect(snap.getHomeTeam()).toBeInstanceOf(Team);
                expect(snap.getAwayTeam()).toBeInstanceOf(Team);
                expect(snap.getBall()).toBeInstanceOf(Ball);
                expect([Side.HOME, Side.AWAY]).toContain(snap.getHomeTeam().getSide());
                expect([Side.HOME, Side.AWAY]).toContain(snap.getAwayTeam().getSide());
                expect(typeof snap.getTurn()).toBe('number');
            }
        });

        test('DEVE criar um snapshot com parâmetros definidos', () => {
            const snap = randomGameSnapshot({ turn: 42 });
            expect(snap.getTurn()).toBe(42);
        });
    });
});

import { describe, expect, test } from 'vitest';

import { Ball, GameInspector, PlayerState, Side, Team } from '@/core.js';

import {
    createRandomSnapshot,
    fromGameSnapshot,
    randomGameInspector,
    randomGameInspectorInOnDefending,
    randomGameInspectorInOnDisputing,
    randomGameInspectorInOnHolding,
    randomGameInspectorInOnSupporting,
} from '@/utils.js';

describe('Utils/GameInspector', () => {
    describe('Factories', () => {
        test('DEVE criar um GameInspector a partir de snapshot', () => {
            const snap = createRandomSnapshot();
            const player = snap.getHomeTeam().getPlayer(1);
            const gi = fromGameSnapshot(Side.HOME, 1, snap);
            expect(gi).toBeInstanceOf(GameInspector);
            expect(gi.getMyNumber()).toBe(1);
            expect(gi.getMyTeamSide()).toBe(Side.HOME);
            expect(gi.getMyTeam()).toBeInstanceOf(Team);
            expect(gi.getOpponentTeam()).toBeInstanceOf(Team);
            expect(gi.getBall()).toBeInstanceOf(Ball);
        });

        test('DEVE criar um GameInspector aleatório válido', () => {
            for (let i = 0; i < 10; i++) {
                const gi = randomGameInspector();
                expect(gi).toBeInstanceOf(GameInspector);
                expect([Side.HOME, Side.AWAY]).toContain(gi.getMyTeamSide());
                expect(typeof gi.getMyNumber()).toBe('number');
                expect(gi.getMyTeam()).toBeInstanceOf(Team);
                expect(gi.getOpponentTeam()).toBeInstanceOf(Team);
                expect(gi.getBall()).toBeInstanceOf(Ball);
            }
        });

        test('DEVE criar um GameInspector em cada estado de jogador', () => {
            const holding = randomGameInspectorInOnHolding({});
            expect(holding.getMyState()).toBe(PlayerState.HOLDING);
            const defending = randomGameInspectorInOnDefending({});
            expect(defending.getMyState()).toBe(PlayerState.DEFENDING);
            const disputing = randomGameInspectorInOnDisputing({});
            expect(disputing.getMyState()).toBe(PlayerState.DISPUTING);
            const supporting = randomGameInspectorInOnSupporting({});
            expect(supporting.getMyState()).toBe(PlayerState.SUPPORTING);
        });
    });
});

import { describe, expect, test } from 'vitest';

import { Ball, GameInspector, PlayerState, Side, Team } from '@/core.js';

import {
    fromGameSnapshot,
    randomGameInspector,
    randomGameInspectorInAsGoalKeeper,
    randomGameInspectorInOnDefending,
    randomGameInspectorInOnDisputing,
    randomGameInspectorInOnHolding,
    randomGameInspectorInOnSupporting,
    randomGameSnapshot,
} from '@/utils.js';

import { ErrGameInvalidPlayerState } from '@/errors.js';

describe('Utils/GameInspector', () => {
    describe('Factories', () => {
        test('DEVE criar um GameInspector a partir de snapshot', () => {
            const snap = randomGameSnapshot();
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
            for (let i = 0; i < 100; i++) {
                const gi = randomGameInspector();
                expect(gi).toBeInstanceOf(GameInspector);
                expect([Side.HOME, Side.AWAY]).toContain(gi.getMyTeamSide());
                expect(typeof gi.getMyNumber()).toBe('number');
                expect(gi.getMyTeam()).toBeInstanceOf(Team);
                expect(gi.getOpponentTeam()).toBeInstanceOf(Team);
                expect(gi.getBall()).toBeInstanceOf(Ball);
            }
        });

        test('DEVE lançar u erro ao gerar un GaneInspector com um player state inválido', () => {
            expect(() => randomGameInspector({ playerState: 'Invalid' as PlayerState })).toThrow(
                ErrGameInvalidPlayerState
            );
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

            expect(randomGameInspectorInAsGoalKeeper({ playerState: PlayerState.HOLDING }).getMyState()).toBe(
                PlayerState.HOLDING
            );
            expect(randomGameInspectorInAsGoalKeeper({ playerState: PlayerState.DEFENDING }).getMyState()).toBe(
                PlayerState.DEFENDING
            );
            expect(randomGameInspectorInAsGoalKeeper({ playerState: PlayerState.DISPUTING }).getMyState()).toBe(
                PlayerState.DISPUTING
            );
            expect(randomGameInspectorInAsGoalKeeper({ playerState: PlayerState.SUPPORTING }).getMyState()).toBe(
                PlayerState.SUPPORTING
            );
        });

        test('DEVE lançar um erro ao criar GameInspector com estado de jogador inválido', () => {
            expect(() => randomGameInspectorInAsGoalKeeper({ playerState: 'Invalid' as PlayerState })).toThrow(
                ErrGameInvalidPlayerState
            );
        });
    });
});

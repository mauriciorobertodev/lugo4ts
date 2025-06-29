import { IBot, PlayerState, Side } from '@/index.js';
import { BotPerformanceTester } from '@/stress.js';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { Velocity } from '@/generated/physics.js';
import { Move, Order } from '@/generated/server.js';

// Mock do console para evitar output durante os testes
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
const consoleTableSpy = vi.spyOn(console, 'table').mockImplementation(() => {});

describe('Core/Stress', () => {
    let mockBot: IBot;
    let tester: BotPerformanceTester;

    beforeEach(() => {
        // Mock do bot
        mockBot = {
            onDisputing: vi.fn().mockReturnValue([]),
            onHolding: vi.fn().mockReturnValue([]),
            onDefending: vi.fn().mockReturnValue([]),
            onSupporting: vi.fn().mockReturnValue([]),
            asGoalkeeper: vi.fn().mockReturnValue([]),
            beforeActions: vi.fn(),
            afterActions: vi.fn(),
            onReady: vi.fn(),
        };

        tester = new BotPerformanceTester(mockBot);

        // Limpar mocks
        vi.clearAllMocks();
    });

    afterEach(() => {
        consoleSpy.mockClear();
        consoleTableSpy.mockClear();
    });

    test('deve criar uma instância com bot', () => {
        expect(tester).toBeInstanceOf(BotPerformanceTester);
    });

    test('setSide deve configurar o lado do time', () => {
        tester.setSide(Side.AWAY);
        // Como side é privado, testamos indiretamente através da execução
        expect(tester.setSide(Side.AWAY)).toBe(tester);
    });

    test('checkOnDisputingPerf deve adicionar teste de disputa', () => {
        expect(tester.checkOnDisputingPerf(10)).toBe(tester);
    });

    test('checkOnHoldingPerf deve adicionar teste de posse', () => {
        expect(tester.checkOnHoldingPerf(5)).toBe(tester);
    });

    test('checkOnDefendingPerf deve adicionar teste de defesa', () => {
        expect(tester.checkOnDefendingPerf(8)).toBe(tester);
    });

    test('checkOnSupportingPerf deve adicionar teste de suporte', () => {
        expect(tester.checkOnSupportingPerf(6)).toBe(tester);
    });

    test('checkAsGoalkeeperPerf deve adicionar teste de goleiro', () => {
        expect(tester.checkAsGoalkeeperPerf(3)).toBe(tester);
    });

    test('run deve executar testes de disputa', async () => {
        tester.checkOnDisputingPerf(2);
        await tester.run();

        expect(mockBot.onDisputing).toHaveBeenCalledTimes(2);
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleTableSpy).toHaveBeenCalled();
    });

    test('run deve executar testes de posse', async () => {
        tester.checkOnHoldingPerf(2);
        await tester.run();

        expect(mockBot.onHolding).toHaveBeenCalledTimes(2);
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleTableSpy).toHaveBeenCalled();
    });

    test('run deve executar testes de defesa', async () => {
        tester.checkOnDefendingPerf(2);
        await tester.run();

        expect(mockBot.onDefending).toHaveBeenCalledTimes(2);
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleTableSpy).toHaveBeenCalled();
    });

    test('run deve executar testes de suporte', async () => {
        tester.checkOnSupportingPerf(2);
        await tester.run();

        expect(mockBot.onSupporting).toHaveBeenCalledTimes(2);
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleTableSpy).toHaveBeenCalled();
    });

    test('run deve executar testes de goleiro', async () => {
        tester.checkAsGoalkeeperPerf(2);
        await tester.run();

        expect(mockBot.asGoalkeeper).toHaveBeenCalledTimes(2);
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleTableSpy).toHaveBeenCalled();
    });

    test('run deve executar múltiplos testes', async () => {
        tester.checkOnDisputingPerf(1).checkOnHoldingPerf(1).checkOnDefendingPerf(1);

        await tester.run();

        expect(mockBot.onDisputing).toHaveBeenCalledTimes(1);
        expect(mockBot.onHolding).toHaveBeenCalledTimes(1);
        expect(mockBot.onDefending).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleTableSpy).toHaveBeenCalled();
    });

    test('run deve funcionar com bot que retorna orders', async () => {
        const mockMove = Move.create({ velocity: Velocity.create({ direction: { x: 1, y: 0 }, speed: 5 }) });
        const mockOrders = [Order.create({ action: { oneofKind: 'move', move: mockMove } })];
        mockBot.onDisputing = vi.fn().mockReturnValue(mockOrders);

        tester.checkOnDisputingPerf(1);
        await tester.run();

        expect(mockBot.onDisputing).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleTableSpy).toHaveBeenCalled();
    });

    test('run deve funcionar sem testes configurados', async () => {
        await tester.run();

        expect(mockBot.onDisputing).not.toHaveBeenCalled();
        expect(mockBot.onHolding).not.toHaveBeenCalled();
        expect(mockBot.onDefending).not.toHaveBeenCalled();
        expect(mockBot.onSupporting).not.toHaveBeenCalled();
        expect(mockBot.asGoalkeeper).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleTableSpy).toHaveBeenCalled();
    });

    test('métodos de configuração devem retornar this para chaining', () => {
        const result = tester
            .setSide(Side.AWAY)
            .checkOnDisputingPerf(1)
            .checkOnHoldingPerf(1)
            .checkOnDefendingPerf(1)
            .checkOnSupportingPerf(1)
            .checkAsGoalkeeperPerf(1);

        expect(result).toBe(tester);
    });
});

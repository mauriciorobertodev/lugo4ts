import { GameInspector, PlayerState, SPECS, Side } from '@/core.js';
import { IBot, IGameInspector } from '@/interfaces.js';
import { randomGameInspector } from '@/utils.js';
import chalk from 'chalk';
import { performance } from 'perf_hooks';

import { Order } from '@/generated/server.js';

type TestCase = 'onDisputing' | 'onHolding' | 'onDefending' | 'onSupporting' | 'asGoalkeeper';

interface InternalTest {
    case: TestCase;
    times: number;
}

interface TestResult {
    case: TestCase;
    averageTimeMs: number;
    totalTimeMs: number;
    runs: number;
    averageOrders: number;
}

export class BotPerformanceTester {
    private side: Side = Side.HOME;
    private tests: InternalTest[] = [];

    constructor(private bot: IBot) {}

    setSide(side: Side): this {
        this.side = side;
        return this;
    }

    checkOnDisputingPerf(times: number): this {
        this.tests.push({ case: 'onDisputing', times });
        return this;
    }

    checkOnHoldingPerf(times: number): this {
        this.tests.push({ case: 'onHolding', times });
        return this;
    }

    checkOnDefendingPerf(times: number): this {
        this.tests.push({ case: 'onDefending', times });
        return this;
    }

    checkOnSupportingPerf(times: number): this {
        this.tests.push({ case: 'onSupporting', times });
        return this;
    }

    checkAsGoalkeeperPerf(times: number): this {
        this.tests.push({ case: 'asGoalkeeper', times });
        return this;
    }

    async run(): Promise<void> {
        const results: TestResult[] = [];

        console.log(chalk.blueBright('\n🚀 Iniciando testes de performance...\n'));
        console.log(chalk.gray(`Lado do time: ${this.side}\n`));

        for (const test of this.tests) {
            const times: number[] = [];
            let totalOrders = 0;

            console.log(chalk.yellow(`▶ Testando: ${test.case} (${test.times} execuções)`));

            for (let i = 0; i < test.times; i++) {
                const start = performance.now();
                let inspector: IGameInspector;
                let orders: Order[] = [];

                switch (test.case) {
                    case 'onDisputing':
                        inspector = randomGameInspector({
                            playerState: PlayerState.DISPUTING,
                            playerSide: this.side,
                        });
                        orders = this.bot.onDisputing(inspector);
                        break;
                    case 'onHolding':
                        inspector = randomGameInspector({
                            playerState: PlayerState.HOLDING,
                            playerSide: this.side,
                        });
                        orders = this.bot.onHolding(inspector);
                        break;
                    case 'onDefending':
                        inspector = randomGameInspector({
                            playerState: PlayerState.DEFENDING,
                            playerSide: this.side,
                        });
                        orders = this.bot.onDefending(inspector);
                        break;
                    case 'onSupporting':
                        inspector = randomGameInspector({
                            playerState: PlayerState.SUPPORTING,
                            playerSide: this.side,
                        });
                        orders = this.bot.onSupporting(inspector);
                        break;
                    case 'asGoalkeeper':
                        inspector = randomGameInspector({
                            playerNumber: SPECS.GOALKEEPER_NUMBER,
                            playerState: PlayerState.DEFENDING,
                            playerSide: this.side,
                        });
                        orders = this.bot.asGoalkeeper(inspector, inspector.getMyState());
                        break;
                }

                totalOrders += orders.length;
                const end = performance.now();
                times.push(end - start);

                console.log(
                    chalk.gray(
                        `   ➤ Execução [${i + 1}/${test.times}] levou ${chalk.green((end - start).toFixed(2) + 'ms')}`
                    )
                );
            }

            const totalTime = times.reduce((a, b) => a + b, 0);
            const average = totalTime / test.times;

            results.push({
                case: test.case,
                averageTimeMs: average,
                totalTimeMs: totalTime,
                runs: test.times,
                averageOrders: totalOrders / test.times,
            });

            console.log(chalk.cyan(`✔ Finalizado: ${test.case} (${average.toFixed(2)}ms em média)\n`));
        }

        console.log(chalk.magentaBright('📊 Resultados finais:\n'));
        console.table(results);

        console.log(chalk.greenBright('\n✅ Todos os testes foram concluídos com sucesso!\n'));
    }
}

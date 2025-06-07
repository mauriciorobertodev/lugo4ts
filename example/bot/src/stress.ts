import { BotPerformanceTester } from '../../../src/core/stress.js';
import { Client, Env, Mapper, Side } from '../../../src/index.js';
import { BotTester } from './bot.js';
import { MAPPER_COLS, MAPPER_ROWS } from './settings.js';

const mapper = new Mapper(MAPPER_COLS, MAPPER_ROWS, Side.HOME);

const bot = new BotTester(mapper);

const tester = new BotPerformanceTester(bot);

const TESTS = 10;

tester.checkOnDisputingPerf(TESTS);
tester.checkOnHoldingPerf(TESTS);
tester.checkOnDefendingPerf(TESTS);
tester.checkOnSupportingPerf(TESTS);
tester.checkAsGoalkeeperPerf(TESTS);

tester.setSide(Side.HOME);
tester.run();

// tester.setSide(Side.AWAY);
// tester.run();

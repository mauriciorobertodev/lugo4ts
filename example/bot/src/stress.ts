import { Mapper, Side } from "@mauricioroberto/lugo4ts";
import { BotPerformanceTester } from "@mauricioroberto/lugo4ts/stress";
import { BotTester } from "./bot.js";
import { MAPPER_COLS, MAPPER_ROWS } from "./settings.js";

const mapper = new Mapper(MAPPER_COLS, MAPPER_ROWS);

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

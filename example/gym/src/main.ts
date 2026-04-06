import { Gym } from "@/gym.js";
import { DummyKicker, DummyStatue, Side, StartInlineFormation, logger, randomGameInspectorInOnHolding } from "@/index.js";

import { MyBot } from "./bot.js";
import { EnvironmentOpponentHolder } from "./environments/opponent-holder-kicker.js";
import { BotGoalkeeperTrainer } from "./trainers/bot-goalkeeper.trainer.js";

logger.enable();

console.log(randomGameInspectorInOnHolding({ playerSide: Side.HOME, playerNumber: 1 }));

// salvar como json
console.log(JSON.stringify(randomGameInspectorInOnHolding({ playerSide: Side.HOME, playerNumber: 1 }), null, 2));

// new Gym()
//     .withTurnDuration(50)
//     .withServerAddress('localhost:6000')
//     .withTraineeNumber(1)
//     .withTraineeSide(Side.HOME)
//     .withEnvironment(() => new EnvironmentOpponentHolder())
//     .withMyBots(() => new MyBot())
//     .withMyInitialFormation(() => new StartInlineFormation())
//     .withOpponentBots(() => new DummyKicker())
//     .withOpponentInitialFormation(() => new StartInlineFormation())
//     .withTrainer(() => new BotGoalkeeperTrainer())
//     .start();

import { logger, randomGameInspectorInOnHolding, Side } from "@mauricioroberto/lugo4ts";

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

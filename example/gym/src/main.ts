import { Gym } from '@/gym.js';
import { DummyStatue, Side, StartInlineFormation, logger } from '@/index.js';

import { MyBot } from './bot.js';
import { EnvironmentOpponentHolder } from './environments/opponent-holder.js';
import { BotGoalkeeperTrainer } from './trainers/bot-goalkeeper.trainer.js';

logger.enable();

const trainer = new BotGoalkeeperTrainer();
// await trainer.init();

new Gym()
    .withServerAddress('localhost:6000')
    .withPlayerNumber(1)
    .withTrainingSide(Side.HOME)
    .withEnvironment(() => new EnvironmentOpponentHolder())
    .withMyBots(() => new MyBot())
    .withMyInitialFormation(() => new StartInlineFormation())
    .withOpponentBots(() => new DummyStatue())
    .withOpponentInitialFormation(() => new StartInlineFormation())
    .withTrainer(trainer)
    .start();

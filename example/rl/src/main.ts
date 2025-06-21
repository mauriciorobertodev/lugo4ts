import { BotKick } from '../../../src/helpers/bot-kicker.js';
import { BotStatue } from '../../../src/helpers/bot-statue.js';
import { Side } from '../../../src/index.js';
import { Gym } from '../../../src/rl/gym.js';
import { EnvironmentOpponentHolder } from './environments/opponent-holder.js';
import { GoalkeeperCatcherTrainer } from './trainers/goalkeeper-catch.trainer.js';

const trainer = new GoalkeeperCatcherTrainer();
await trainer.init();

new Gym()
    .withPlayerNumber(1)
    .withTrainingSide(Side.HOME)
    .withEnvironment(() => new EnvironmentOpponentHolder())
    .withMyBots(() => {
        return new BotStatue();
    })
    .withOpponentBots(() => {
        return new BotKick();
    })
    .withTrainer(trainer)
    .start();

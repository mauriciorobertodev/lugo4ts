import { Gym } from '@/gym.js';

import { Side } from '@/core.js';

import { DummyStatue } from '@/playground.js';

import { MyBot } from './bot.js';
import { EnvironmentOpponentHolder } from './environments/opponent-holder.js';
import { BotGoalkeeperTrainer } from './trainers/bot-goalkeeper.trainer.js';

const trainer = new BotGoalkeeperTrainer();
// await trainer.init();

new Gym()
    .withServerAddress('localhost:6000')
    .withPlayerNumber(1)
    .withTrainingSide(Side.HOME)
    .withEnvironment(() => new EnvironmentOpponentHolder())
    .withMyBots(() => {
        return new MyBot();
    })
    .withOpponentBots(() => {
        return new DummyStatue();
    })
    .withTrainer(trainer)
    .start();

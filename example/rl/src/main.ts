import { Gym, Side } from '@/core.js';

import { DummyStatue } from '@/playground.js';

import { EnvironmentOpponentHolder } from './environments/opponent-holder.js';
import { GoalkeeperCatcherTrainer } from './trainers/goalkeeper-catch.trainer.js';

const trainer = new GoalkeeperCatcherTrainer();
await trainer.init();

new Gym()
    .withServerAddress('localhost:6000')
    .withPlayerNumber(1)
    .withTrainingSide(Side.HOME)
    .withEnvironment(() => new EnvironmentOpponentHolder())
    .withMyBots(() => {
        return new DummyStatue();
    })
    .withOpponentBots(() => {
        return new DummyStatue();
    })
    .withTrainer(trainer)
    .start();

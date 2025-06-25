import type { IBot } from '@/interfaces/bot.js';
import type { IGymTrainer } from '@/interfaces/gym-trainer.js';

import type { Environment } from '@/core/environment.js';
import type { Side } from '@/core/side.js';

export type BotFactory = (number: number, side: Side) => IBot;

export interface IGym {
    withPlayerNumber(playerNumber: number): this;
    withTrainingSide(side: Side): this;
    withEnvironment(environment: () => Environment): this;
    withMyBots(factory: BotFactory): this;
    withOpponentBots(factory: BotFactory): this;
    withTrainer(trainer: IGymTrainer): this;
    start(): Promise<void>;
}

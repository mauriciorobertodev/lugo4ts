import { IBot, IGymTrainer } from '@/interfaces.js';

import { Environment, Side } from '@/core.js';

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

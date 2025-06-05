import type { IBot } from './bot.js';

export interface IClient {
    playAsBot(bot: IBot): void;
}

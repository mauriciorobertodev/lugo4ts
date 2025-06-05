import type { IBot } from './bot.ts';

export interface IClient {
    playAsBot(bot: IBot): void;
}

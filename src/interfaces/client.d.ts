import type { IBot } from './bot.d.ts';

export interface IClient {
    playAsBot(bot: IBot): void;
}

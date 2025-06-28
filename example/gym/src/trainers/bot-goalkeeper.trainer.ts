import { GymSession, IGymSession, IGymTrainer } from '@/gym.js';
import { BotTrainer } from '@/gym/bot-trainer.js';

import { IBot } from '@/interfaces/bot.js';

import { IGameInspector, PlayerState } from '@/core.js';

import { MyBot } from '../bot.js';

// ──────────────────────────────────────────────────────────────
// Trainer
// ──────────────────────────────────────────────────────────────
export class BotGoalkeeperTrainer extends BotTrainer {
    private bot: IBot;
    constructor() {
        super();
        this.bot = new MyBot();
    }

    getBot(): IBot {
        return this.bot;
    }

    async evaluate(prev: IGameInspector, curr: IGameInspector): Promise<{ reward: number; done: boolean }> {
        const holder = curr.getBallHolder();
        if (holder && holder.is(curr.getMe())) {
            // Pegou => termina o episódio com grande recompensa
            return { reward: 1.0, done: true };
        }

        const prevScore = prev.getOpponentTeam().getScore();
        const currScore = curr.getOpponentTeam().getScore();
        if (currScore > prevScore) {
            // Tomou gol => termina o episódio com grande penalidade
            return { reward: -1.0, done: true };
        }

        return { reward: 0, done: false };
    }

    async train(session: IGymSession): Promise<void> {
        const GAMES = 100; // número de jogos para treinar
        console.log(`Treinando goleiro por ${GAMES} jogos...`);
        const MAX_TURNS = 100; // número máximo de turnos por jogo

        let defenses = 0;
        let goals = 0;

        for (let game = 1; game <= GAMES; game++) {
            for (let turn = 1; turn <= MAX_TURNS; turn++) {
                const { reward, done } = await session.update();
                if (reward > 0) defenses++;
                if (reward < 0) goals++;

                if (done) break; // fim do jogo
            }

            await session.reset();
        }

        await session.stop();
        console.log(`Treinamento concluído! Defesas: ${defenses}, Gols sofridos: ${goals}`);
    }
}

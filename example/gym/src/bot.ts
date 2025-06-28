import { Order } from '@/generated/server.js';

import { IBot } from '@/interfaces/bot.js';

import { IGameInspector, PlayerState } from '@/core.js';

export class MyBot implements IBot {
    onHolding(inspector: IGameInspector): Order[] {
        return [];
    }

    onDisputing(inspector: IGameInspector): Order[] {
        return [];
    }

    onDefending(inspector: IGameInspector): Order[] {
        return [];
    }

    onSupporting(inspector: IGameInspector): Order[] {
        return [];
    }

    asGoalkeeper(inspector: IGameInspector, state: PlayerState): Order[] {
        return [];
    }

    beforeActions(inspector: IGameInspector): void {}
    afterActions(inspector: IGameInspector): void {}
    onReady(inspector: IGameInspector): void {}
}

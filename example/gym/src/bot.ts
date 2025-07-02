import { GameInspector, PlayerState } from '@/index.js';

import { Order } from '@/generated/server.js';

import { IBot } from '@/interfaces/bot.js';

export class MyBot implements IBot {
    onHolding(inspector: GameInspector): Order[] {
        return [];
    }

    onDisputing(inspector: GameInspector): Order[] {
        return [];
    }

    onDefending(inspector: GameInspector): Order[] {
        return [];
    }

    onSupporting(inspector: GameInspector): Order[] {
        return [];
    }

    asGoalkeeper(inspector: GameInspector, state: PlayerState): Order[] {
        return [];
    }

    beforeActions(inspector: GameInspector): void {}
    afterActions(inspector: GameInspector): void {}
    onReady(inspector: GameInspector): void {}
}

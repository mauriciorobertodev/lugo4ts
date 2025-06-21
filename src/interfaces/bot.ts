import type { Order } from '@/generated/server.js';

import type { IGameInspector } from '@/interfaces.js';

import type { PlayerState } from '@/core.js';

export interface IBot {
    beforeActions(inspector: IGameInspector): void;
    afterActions(inspector: IGameInspector): void;

    onReady(inspector: IGameInspector): void;

    onHolding(inspector: IGameInspector): Order[];
    onDisputing(inspector: IGameInspector): Order[];
    onDefending(inspector: IGameInspector): Order[];
    onSupporting(inspector: IGameInspector): Order[];

    asGoalkeeper(inspector: IGameInspector, state: PlayerState): Order[];
}

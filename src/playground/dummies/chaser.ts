import type { Order } from "@/generated/server.js";

import type { IBot } from "@/interfaces/bot.js";
import type { IGameInspector } from "@/interfaces/game-inspector.js";
import type { PlayerState } from "@/interfaces/player.js";

export class DummyChaser implements IBot {
	beforeActions(_inspector: IGameInspector): void {}
	afterActions(_inspector: IGameInspector): void {}
	onReady(_inspector: IGameInspector): void {}

	onHolding(inspector: IGameInspector): Order[] {
		return this.chaseBall(inspector);
	}

	onDisputing(inspector: IGameInspector): Order[] {
		return this.chaseBall(inspector);
	}

	onDefending(inspector: IGameInspector): Order[] {
		return this.chaseBall(inspector);
	}

	onSupporting(inspector: IGameInspector): Order[] {
		return this.chaseBall(inspector);
	}

	asGoalkeeper(inspector: IGameInspector, _state: PlayerState): Order[] {
		return this.chaseBall(inspector);
	}

	private chaseBall(inspector: IGameInspector): Order[] {
		const orders: Order[] = [];

		const order = inspector.makeOrderMoveToPoint(inspector.getBallPosition());

		orders.push(order);

		return orders;
	}
}

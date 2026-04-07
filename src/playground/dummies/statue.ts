import type { Order } from "@/generated/server.js";

import type { IBot } from "@/interfaces/bot.interface.js";
import type { IGameInspector } from "@/interfaces/inspector.interface.js";
import type { PlayerState } from "@/interfaces/player.interface.js";

export class DummyStatue implements IBot {
	beforeActions(_inspector: IGameInspector): void {}
	afterActions(_inspector: IGameInspector): void {}
	onReady(_inspector: IGameInspector): void {}

	onHolding(_inspector: IGameInspector): Order[] {
		const orders: Order[] = [];

		return orders;
	}

	onDisputing(_inspector: IGameInspector): Order[] {
		const orders: Order[] = [];

		return orders;
	}

	onDefending(_inspector: IGameInspector): Order[] {
		const orders: Order[] = [];

		return orders;
	}

	onSupporting(_inspector: IGameInspector): Order[] {
		const orders: Order[] = [];

		return orders;
	}

	asGoalkeeper(_inspector: IGameInspector, _state: PlayerState): Order[] {
		const orders: Order[] = [];

		return orders;
	}
}

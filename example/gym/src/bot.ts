import type { GameInspector, IBot, Order, PlayerState } from "@mauricioroberto/lugo4ts";

export class MyBot implements IBot {
	onHolding(_inspector: GameInspector): Order[] {
		return [];
	}

	onDisputing(_inspector: GameInspector): Order[] {
		return [];
	}

	onDefending(_inspector: GameInspector): Order[] {
		return [];
	}

	onSupporting(_inspector: GameInspector): Order[] {
		return [];
	}

	asGoalkeeper(_inspector: GameInspector, _state: PlayerState): Order[] {
		return [];
	}

	beforeActions(_inspector: GameInspector): void {}
	afterActions(_inspector: GameInspector): void {}
	onReady(_inspector: GameInspector): void {}
}

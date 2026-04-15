import type { Side } from "@/core/side.js";
import { SPECS } from "@/core/specs.js";
import type { IShotClock, ShotClockObject } from "@/interfaces/shot-clock.interface.js";

export class ShotClock implements IShotClock {
	constructor(
		private side: Side,
		private remainingTurns: number,
	) {}

	getRemainingTurnsWithBall(): number {
		return this.remainingTurns;
	}

	getTurnsWithBall(): number {
		return SPECS.SHOT_CLOCK_TURNS - this.remainingTurns;
	}

	getRemainingSecondsWithBall(): number {
		return Math.ceil(this.remainingTurns / SPECS.TURNS_PER_SECOND);
	}

	getSecondsWithBall(): number {
		return Math.floor(this.getTurnsWithBall() / SPECS.TURNS_PER_SECOND);
	}

	getHolderSide(): Side {
		return this.side;
	}

	clone(): ShotClock {
		return new ShotClock(this.side, this.remainingTurns);
	}

	toObject(): ShotClockObject {
		return {
			holderSide: this.side,
			remainingTurns: this.remainingTurns,
		};
	}
}

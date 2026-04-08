import { type GameInspector, type IBot, type Mapper, type Order, type Point, PlayerState } from "@mauricioroberto/lugo4ts";
import { DEFENSIVE, NORMAL, OFFENSIVE } from "./settings.js";

export class BotTester implements IBot {
	constructor(public mapper: Mapper) {}

	onDisputing(inspector: GameInspector): Order[] {
		const ballHolder = inspector.getBallHolder();
		if (ballHolder?.getTeamSide() === inspector.getMyTeamSide()) {
			// Talvez seja um passe?
		}

		const orders: Order[] = [];

		const ballPosition = inspector.getBall().getPosition();
		const ballRegion = this.mapper.getRegionFromPoint(ballPosition);
		const myRegion = this.mapper.getRegionFromPoint(inspector.getMyPosition());

		let moveDestination = this.getMyExpectedPosition(inspector, this.mapper);

		if (myRegion.distanceToRegion(ballRegion) <= 2) {
			moveDestination = ballPosition;
		}

		const moveOrder = inspector.makeOrderMoveToPoint(moveDestination);
		const catchOrder = inspector.makeOrderCatch();

		orders.push(moveOrder, catchOrder);

		return orders;
	}

	onHolding(inspector: GameInspector): Order[] {
		const orders: Order[] = [];

		const attackGoalCenter = inspector.getAttackGoal().getCenter();
		const opponentGoalRegion = this.mapper.getRegionFromPoint(attackGoalCenter);
		const currentRegion = this.mapper.getRegionFromPoint(inspector.getMyPosition());

		if (currentRegion.distanceToRegion(opponentGoalRegion) <= 2) {
			orders.push(inspector.makeOrderKickToPoint(attackGoalCenter));
		} else {
			orders.push(inspector.makeOrderMoveToPoint(attackGoalCenter));
		}

		return orders;
	}

	onDefending(inspector: GameInspector): Order[] {
		const orders: Order[] = [];

		const ballPosition = inspector.getBall().getPosition();
		const ballRegion = this.mapper.getRegionFromPoint(ballPosition);
		const myRegion = this.mapper.getRegionFromPoint(inspector.getMyPosition());

		let moveDestination = this.getMyExpectedPosition(inspector, this.mapper);

		if (myRegion.distanceToRegion(ballRegion) <= 2) {
			moveDestination = ballPosition;
		}

		const moveOrder = inspector.makeOrderMoveToPoint(moveDestination);
		const catchOrder = inspector.makeOrderCatch();

		orders.push(moveOrder, catchOrder);

		return orders;
	}

	onSupporting(inspector: GameInspector): Order[] {
		const orders: Order[] = [];
		const ballPosition = inspector.getBall().getHolder()?.getPosition();

		if (ballPosition) {
			orders.push(inspector.makeOrderMoveToPoint(ballPosition));
		}

		return orders;
	}

	asGoalkeeper(inspector: GameInspector, state: PlayerState): Order[] {
		const orders: Order[] = [];

		let position = inspector.getBall().getPosition();

		if (state !== PlayerState.DISPUTING) {
			position = inspector.getDefenseGoal().getCenter();
		}

		orders.push(inspector.makeOrderMoveToPoint(position));
		orders.push(inspector.makeOrderCatch());

		return orders;
	}

	getMyExpectedPosition(inspector: GameInspector, mapper: Mapper): Point {
		const ballPosition = inspector.getBall().getPosition();
		const ballRegion = mapper.getRegionFromPoint(ballPosition);
		const fieldThird = this.mapper.getCols() / 3;
		const ballCols = ballRegion.getCol();

		let tacticPositions = OFFENSIVE;
		if (ballCols < fieldThird) {
			tacticPositions = DEFENSIVE;
		} else if (ballCols < fieldThird * 2) {
			tacticPositions = NORMAL;
		}

		const position = tacticPositions[inspector.getMyNumber()];
		const expectedRegion = mapper.getRegion(position.col, position.row);

		return expectedRegion.getCenter();
	}

	onReady(_inspector: GameInspector): void {}

	beforeActions(_inspector: GameInspector): void {}

	afterActions(_inspector: GameInspector): void {}
}

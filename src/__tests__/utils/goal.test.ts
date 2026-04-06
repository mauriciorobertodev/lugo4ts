import { describe, expect, test } from "vitest";
import { AWAY_GOAL, Goal, goalFromSide, HOME_GOAL, randomGoal, Side, SPECS } from "@/index.js";

describe("Utils/Goal", () => {
	test("DEVE criar um novo gol de ambas as sides", () => {
		const homeGoal = HOME_GOAL;
		const awayGoal = AWAY_GOAL;

		expect(homeGoal.getSide()).toBe(Side.HOME);
		expect(awayGoal.getSide()).toBe(Side.AWAY);

		expect(homeGoal.getTopPole().getX()).toBe(0);
		expect(homeGoal.getTopPole().getY()).toBe(SPECS.GOAL_MAX_Y);

		expect(homeGoal.getCenter().getX()).toBe(0);
		expect(homeGoal.getCenter().getY()).toBe(SPECS.CENTER_Y_COORDINATE);

		expect(homeGoal.getBottomPole().getX()).toBe(0);
		expect(homeGoal.getBottomPole().getY()).toBe(SPECS.GOAL_MIN_Y);

		expect(awayGoal.getTopPole().getX()).toBe(SPECS.MAX_X_COORDINATE);
		expect(awayGoal.getTopPole().getY()).toBe(SPECS.GOAL_MAX_Y);

		expect(awayGoal.getCenter().getX()).toBe(SPECS.MAX_X_COORDINATE);
		expect(awayGoal.getCenter().getY()).toBe(SPECS.CENTER_Y_COORDINATE);

		expect(awayGoal.getBottomPole().getX()).toBe(SPECS.MAX_X_COORDINATE);
		expect(awayGoal.getBottomPole().getY()).toBe(SPECS.GOAL_MIN_Y);
	});

	test("DEVE retornar o gol de uma side", () => {
		const homeGoal = goalFromSide(Side.HOME);
		const awayGoal = goalFromSide(Side.AWAY);

		expect(homeGoal.getSide()).toBe(Side.HOME);
		expect(awayGoal.getSide()).toBe(Side.AWAY);
	});

	test("DEVE retornar um gol de uma side aleatória", () => {
		const goal = randomGoal();

		expect(goal).toBeDefined();
		expect(goal).instanceOf(Goal);
		expect(goal.getSide()).toBeOneOf([Side.HOME, Side.AWAY]);
	});
});

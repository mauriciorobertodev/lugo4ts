import { describe, expect, test } from "vitest";
import { ShotClock, Side, SPECS } from "@/index.js";

describe("Core/ShotClock", () => {
	test("DEVE retornar o número correto de turnos restantes com a bola", () => {
		const shotClock = new ShotClock(Side.HOME, 10);

		expect(shotClock.getRemainingTurnsWithBall()).toBe(10);
	});

	test("DEVE retornar o número correto de turnos passados com a bola", () => {
		const shotClock = new ShotClock(Side.HOME, 5);

		expect(shotClock.getTurnsWithBall()).toBe(SPECS.SHOT_CLOCK_TURNS - 5);
	});

	test("DEVE retornar o lado correto do detentor da bola", () => {
		const shotClock = new ShotClock(Side.HOME, 10);

		expect(shotClock.getHolderSide()).toBe(Side.HOME);
	});
});

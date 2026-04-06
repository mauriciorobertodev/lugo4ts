import { describe, expect, test } from "vitest";
import { fieldCenterPoint, isValidInsideFieldPoint, Point, SPECS } from "@/index.js";

describe("Utils/Field", () => {
	test("DEVE criar um novo Point representando o centro do campo", () => {
		const center = fieldCenterPoint();

		expect(center).toBeInstanceOf(Point);
		expect(center.getX()).toBe(SPECS.CENTER_X_COORDINATE);
		expect(center.getY()).toBe(SPECS.CENTER_Y_COORDINATE);
	});

	test("DEVE validar se um ponto está dentro dos limites do campo", () => {
		const validPoint = new Point(10, 20);
		const invalidPoint = new Point(-1, 20);

		expect(isValidInsideFieldPoint(validPoint)).toBe(true);
		expect(isValidInsideFieldPoint(invalidPoint)).toBe(false);
	});
});

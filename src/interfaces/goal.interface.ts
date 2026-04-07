import type { Side } from "@/core/side.js";
import type { IPoint, PointObject } from "@/interfaces/positionable.interface.js";

export interface IGoal {
	getCenter(): IPoint;
	getSide(): Side;
	getTopPole(): IPoint;
	getBottomPole(): IPoint;

	clone(): IGoal;
	toObject(): GoalObject;
}

export type GoalObject = {
	center: PointObject;
	side: Side;
	topPole: PointObject;
	bottomPole: PointObject;
};

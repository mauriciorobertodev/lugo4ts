import { Ball } from "@/core/ball.js";
import type { Player } from "@/core/player.js";
import type { Point } from "@/core/point.js";
import { SPECS } from "@/core/specs.js";
import type { Vector2D } from "@/core/vector.js";
import type { BallObject } from "@/interfaces/ball.interface.js";

import { fieldCenterPoint } from "@/utils/field.utils.js";
import { fromPlayerObject } from "@/utils/player.utils.js";
import { fromPointObject, randomPoint } from "@/utils/point.utils.js";
import { fromVelocityObject, randomVelocity, zeroedVelocity } from "@/utils/velocity.utils.js";

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function fromBallObject(obj: BallObject): Ball {
	const position = fromPointObject(obj.position);
	const velocity = fromVelocityObject(obj.velocity);
	const holder = obj.holder ? fromPlayerObject(obj.holder) : null;

	return new Ball(position, velocity, holder);
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedBall(): Ball {
	return new Ball(fieldCenterPoint(), zeroedVelocity(), null);
}

export function randomBall({
	holder = null,
	position = randomPoint(),
	direction,
	speed,
	maxSpeed = SPECS.BALL_MAX_SPEED,
}: {
	holder?: Player | null;
	position?: Point;
	direction?: Vector2D;
	speed?: number;
	maxSpeed?: number;
} = {}): Ball {
	const velocity = randomVelocity({ direction, speed, maxSpeed });
	return new Ball(position, velocity, holder);
}

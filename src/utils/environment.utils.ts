// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

import { Environment } from "@/core/environment.js";
import type { EnvironmentObject } from "@/interfaces/environment.interface.js";

import { fromBallObject } from "@/utils/ball.utils.js";
import { fromShotClockObject } from "@/utils/shot-clock.utils.js";
import { fromTeamObject } from "@/utils/team.utils.js";

export function fromEnvironmentObject(obj: EnvironmentObject): Environment {
	const env = new Environment();
	if (obj.name) env.setName(obj.name);
	if (obj.turn) env.setTurn(obj.turn);
	if (obj.ball) env.setBall(fromBallObject(obj.ball));
	if (obj.homeTeam) env.setHomeTeam(fromTeamObject(obj.homeTeam));
	if (obj.awayTeam) env.setAwayTeam(fromTeamObject(obj.awayTeam));
	if (obj.shotClock) env.setShotClock(fromShotClockObject(obj.shotClock));
	return env;
}

export function fromEnvironmentJsonString(json: string): Environment {
	const obj = JSON.parse(json) as EnvironmentObject;
	return fromEnvironmentObject(obj);
}

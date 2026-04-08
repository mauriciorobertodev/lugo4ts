import { Environment, randomPlayer, randomTeam, Side, zeroedBall } from "@mauricioroberto/lugo4ts";

import { DefaultFormation } from "../formations/default.js";

export class DefaultEnvironment extends Environment {
	constructor() {
		super();
		this.setName("Default Environment");
		this.setBall(zeroedBall());

		this.setHomeScore(0);
		this.setHomeTeam(
			randomTeam({
				side: Side.HOME,
				players: Array.from({ length: 11 }, (_, index) => randomPlayer({ number: index + 1, side: Side.HOME })),
			}),
		);
		this.setHomeTeamPositionsByFormation(new DefaultFormation());

		this.setAwayScore(0);
		this.setAwayTeam(
			randomTeam({
				side: Side.AWAY,
				players: Array.from({ length: 11 }, (_, index) => randomPlayer({ number: index + 1, side: Side.AWAY })),
			}),
		);
		this.setAwayTeamPositionsByFormation(new DefaultFormation());
	}
}

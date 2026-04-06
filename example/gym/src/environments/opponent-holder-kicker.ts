import { Environment, fieldCenterPoint, randomBall, randomInitialPosition, randomPlayer, randomTeam, Side, zeroedVector } from "@/index.js";

export class EnvironmentOpponentHolder extends Environment {
	constructor(side: Side = Side.HOME) {
		super();
		this.setName("Environment Opponent Holder");

		this.setHomeScore(0);
		this.setHomeTeam(
			randomTeam({
				side: Side.HOME,
				players: Array.from({ length: 11 }, (_, index) =>
					randomPlayer({
						number: index + 1,
						side: Side.HOME,
						position: randomInitialPosition(side),
						speed: 0,
					}),
				),
			}),
		);
		// this.setHomeTeamPositionsByFormation(new DefaultFormation());

		this.setAwayScore(0);
		this.setAwayTeam(
			randomTeam({
				side: Side.AWAY,
				players: Array.from({ length: 11 }, (_, index) =>
					randomPlayer({
						number: index + 1,
						side: Side.AWAY,
						position: randomInitialPosition(side),
						speed: 0,
					}),
				),
			}),
		);
		// this.setAwayTeamPositionsByFormation(new DefaultFormation());

		const opponent = side === Side.HOME ? this.getAwayTeam() : this.getHomeTeam();
		const holder = opponent?.getRandomPlayer([1]) ?? null;
		this.setBall(randomBall({ holder, position: fieldCenterPoint(), direction: zeroedVector(), speed: 0 }));
	}
}

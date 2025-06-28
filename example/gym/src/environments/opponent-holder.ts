import { Environment } from '../../../../src/core/environment.js';
import {
    Side,
    fieldCenterPoint,
    randomBall,
    randomInitialPosition,
    randomPlayer,
    randomTeam,
    zeroedTeam,
    zeroedVector,
} from '../../../../src/index.js';
import { DefaultFormation } from '../formations/default.js';

export class EnvironmentOpponentHolder extends Environment {
    constructor(side: Side = Side.HOME) {
        super();
        this.setName('Environment Opponent Holder');

        this.setHomeScore(0);
        this.setHomeTeam(
            randomTeam({
                side: Side.HOME,
                players: Array.from({ length: 11 }, (_, index) =>
                    randomPlayer({
                        number: index + 1,
                        side: Side.HOME,
                        position: randomInitialPosition(side),
                    })
                ),
            })
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
                    })
                ),
            })
        );
        // this.setAwayTeamPositionsByFormation(new DefaultFormation());

        const opponent = side === Side.HOME ? this.getAwayTeam() : this.getHomeTeam();
        const holder = opponent?.getRandomPlayer() ?? null;
        this.setBall(randomBall({ holder, position: fieldCenterPoint(), direction: zeroedVector(), speed: 0 }));
    }
}

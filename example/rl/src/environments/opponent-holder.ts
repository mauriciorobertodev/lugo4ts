import { Environment } from '../../../../src/core/environment.js';
import { BallFactory } from '../../../../src/factories/ball.factory.js';
import { PlayerFactory } from '../../../../src/factories/player.factory.js';
import { TeamFactory } from '../../../../src/factories/team.factory.js';
import { Side } from '../../../../src/index.js';
import { PointUtils } from '../../../../src/utils/point.utils.js';
import { DefaultFormation } from '../formations/default.js';

export class EnvironmentOpponentHolder extends Environment {
    constructor(side: Side = Side.HOME) {
        super();
        this.setName('Environment Opponent Holder');

        this.setHomeScore(0);
        this.setHomeTeam(
            TeamFactory.zeroed({
                side: Side.HOME,
                players: Array.from({ length: 11 }, (_, index) =>
                    PlayerFactory.random({
                        number: index + 1,
                        side: Side.HOME,
                        position: PointUtils.createRandomInitialPosition(side),
                    })
                ),
            })
        );
        // this.setHomeTeamPositionsByFormation(new DefaultFormation());

        this.setAwayScore(0);
        this.setAwayTeam(
            TeamFactory.zeroed({
                side: Side.AWAY,
                players: Array.from({ length: 11 }, (_, index) =>
                    PlayerFactory.random({
                        number: index + 1,
                        side: Side.AWAY,
                        position: PointUtils.createRandomInitialPosition(side),
                    })
                ),
            })
        );
        // this.setAwayTeamPositionsByFormation(new DefaultFormation());

        const opponent = side === Side.HOME ? this.getAwayTeam() : this.getHomeTeam();
        const holder = opponent?.getRandomPlayer() ?? null;
        this.setBall(BallFactory.newZeroed({ holder }));
    }
}

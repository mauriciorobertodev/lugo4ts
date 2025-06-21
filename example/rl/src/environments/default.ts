import { Environment } from '../../../../src/core/environment.js';
import { BallFactory } from '../../../../src/factories/ball.factory.js';
import { PlayerFactory } from '../../../../src/factories/player.factory.js';
import { TeamFactory } from '../../../../src/factories/team.factory.js';
import { Side } from '../../../../src/index.js';
import { DefaultFormation } from '../formations/default.js';

export class DefaultEnvironment extends Environment {
    constructor() {
        super();
        this.setName('Default Environment');
        this.setBall(BallFactory.newZeroed());

        this.setHomeScore(0);
        this.setHomeTeam(
            TeamFactory.zeroed({
                side: Side.HOME,
                players: Array.from({ length: 11 }, (_, index) =>
                    PlayerFactory.random({ number: index + 1, side: Side.HOME })
                ),
            })
        );
        this.setHomeTeamPositionsByFormation(new DefaultFormation());

        this.setAwayScore(0);
        this.setAwayTeam(
            TeamFactory.zeroed({
                side: Side.AWAY,
                players: Array.from({ length: 11 }, (_, index) =>
                    PlayerFactory.random({ number: index + 1, side: Side.AWAY })
                ),
            })
        );
        this.setAwayTeamPositionsByFormation(new DefaultFormation());
    }
}

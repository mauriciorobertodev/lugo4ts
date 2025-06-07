import type { Player as LugoPlayer, Team as LugoTeam } from '../generated/server.js';

import { Player } from '../core/player.js';
import { Side, SideFactory } from '../core/side.js';
import { Team } from '../core/team.js';
import { Util } from '../core/util.js';
import { PlayerFactory } from './player.factory.js';

export class TeamFactory {
    public static fromLugoTeam(lugoTeam: LugoTeam): Team {
        const playersArray = lugoTeam.players ?? [];

        return new Team(
            lugoTeam.name ?? '',
            lugoTeam.score ?? 0,
            SideFactory.fromInt(lugoTeam.side ?? 0),
            playersArray.map((lugoPlayer: LugoPlayer) => PlayerFactory.fromLugoPlayer(lugoPlayer))
        );
    }

    public static random({
        name = `Team ${Util.randomInt(1, 1000)}`,
        side = SideFactory.fromInt(Util.randomInt(0, 1)),
        playersCount = 11,
        score = 0,
        players = [],
    }: {
        name?: string;
        side?: Side;
        playersCount?: number;
        score?: number;
        players?: Player[];
    } = {}): Team {
        return new Team(
            name,
            score,
            side,
            Array.from({ length: playersCount }, (_, index) => {
                if (players[index]) {
                    if (players[index].getTeamSide() !== side) {
                        throw new Error(`Player at index ${index} does not match team side ${side}`);
                    }
                    return players[index];
                }

                return PlayerFactory.random({ number: index + 1, side });
            })
        );
    }
}

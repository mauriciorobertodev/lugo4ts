import type { Player as LugoPlayer, Team as LugoTeam } from '../generated/server.js';

import { SideFactory } from '../core/side.js';
import { Team } from '../core/team.js';
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
}

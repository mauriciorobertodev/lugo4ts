import { TeamObject } from '@/interfaces/team.js';

import { Player } from '@/core/player.js';
import { Side } from '@/core/side.js';
import { Team } from '@/core/team.js';

import { fromPlayerObject, randomPlayer } from '@/utils/player.js';
import { randomInt } from '@/utils/random.js';
import { randomSide } from '@/utils/side.js';

import { ErrTeamDuplicatePlayer, ErrTeamInvalidSide } from '@/errors.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function fromTeamObject(obj: TeamObject): Team {
    const players = obj.players.map((p) => fromPlayerObject(p));
    return new Team(obj.name, obj.score, obj.side, players);
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedTeam(): Team {
    return new Team('Zeroed Team', 0, Side.HOME, []);
}

export function randomTeam({
    name = `Team ${randomInt(1, 1000)}`,
    side = randomSide(),
    populate = 11,
    score = 0,
    players = [],
}: {
    name?: string;
    side?: Side;
    populate?: number;
    score?: number;
    players?: Player[];
} = {}): Team {
    players.forEach((p) => {
        if (p.getTeamSide() !== side) throw new ErrTeamInvalidSide(p.getNumber(), side);
    });

    const takenNumbers = new Set<number>();
    for (const p of players) {
        if (takenNumbers.has(p.getNumber())) {
            throw new ErrTeamDuplicatePlayer(p.getNumber());
        }
        takenNumbers.add(p.getNumber());
    }

    const teamPlayers: Player[] = [...players];

    for (let num = 1; teamPlayers.length < populate; num++) {
        if (takenNumbers.has(num)) continue;
        teamPlayers.push(randomPlayer({ number: num, side }));
        takenNumbers.add(num);
    }

    teamPlayers.sort((a, b) => a.getNumber() - b.getNumber());

    return new Team(name, score, side, teamPlayers);
}

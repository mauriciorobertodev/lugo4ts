import { IPlayer, ITeam } from '@/interfaces.js';

import { Side, Team } from '@/core.js';

import { randomInt, randomPlayer, randomSide } from '@/utils.js';

import { ErrTeamDuplicatePlayer, ErrTeamInvalidSide } from '@/errors.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedTeam(): ITeam {
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
    players?: IPlayer[];
} = {}): ITeam {
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

    const teamPlayers: IPlayer[] = [...players];

    for (let num = 1; teamPlayers.length < populate; num++) {
        if (takenNumbers.has(num)) continue;
        teamPlayers.push(randomPlayer({ number: num, side }));
        takenNumbers.add(num);
    }

    teamPlayers.sort((a, b) => a.getNumber() - b.getNumber());

    return new Team(name, score, side, teamPlayers);
}

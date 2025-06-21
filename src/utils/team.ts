import { IPlayer, ITeam } from '@/interfaces.js';

import { Side, Team } from '@/core.js';

import { randomInt, randomPlayer, randomSide } from '@/utils.js';

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
    return new Team(
        name,
        score,
        side,
        Array.from({ length: populate }, (_, index) => {
            if (players[index]) {
                if (players[index].getTeamSide() !== side) {
                    throw new Error(`Player at index ${index} does not match team side ${side}`);
                }
                return players[index];
            }

            return randomPlayer({ number: index + 1, side });
        })
    );
}

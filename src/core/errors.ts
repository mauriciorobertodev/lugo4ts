import type { Side } from './side.js';
import { SPECS } from './specs.js';

export class ErrPlayerNotFound extends Error {
    constructor(
        public side: Side,
        public number: number
    ) {
        super(`Team on side ${side.toString()} does not have player ${number}`);
        this.name = 'ErrPlayerNotFound';
        Object.setPrototypeOf(this, ErrPlayerNotFound.prototype);
    }
}

export class ErrBallNotFound extends Error {
    constructor() {
        super('Ball not found');
        this.name = 'ErrBallNotFound';
        Object.setPrototypeOf(this, ErrBallNotFound.prototype);
    }
}

export class ErrHomeTeamNotFound extends Error {
    constructor() {
        super('Home team not found');
        this.name = 'ErrHomeTeamNotFound';
        Object.setPrototypeOf(this, ErrHomeTeamNotFound.prototype);
    }
}

export class ErrAwayTeamNotFound extends Error {
    constructor() {
        super('Away team not found');
        this.name = 'ErrAwayTeamNotFound';
        Object.setPrototypeOf(this, ErrAwayTeamNotFound.prototype);
    }
}

export class ErrMoveZeroDirection extends Error {
    constructor() {
        super('Cannot move in zero direction');
        this.name = 'ErrMoveZeroDirection';
        Object.setPrototypeOf(this, ErrMoveZeroDirection.prototype);
    }
}

export class ErrKickZeroDirection extends Error {
    constructor() {
        super('Cannot kick in zero direction');
        this.name = 'ErrKickZeroDirection';
        Object.setPrototypeOf(this, ErrKickZeroDirection.prototype);
    }
}

export class ErrJumpZeroDirection extends Error {
    constructor() {
        super('Cannot jump in zero direction');
        this.name = 'ErrJumpZeroDirection';
        Object.setPrototypeOf(this, ErrJumpZeroDirection.prototype);
    }
}

// BOT

export class ErrBotInvalidNumber extends Error {
    constructor(botNumber: string) {
        super(`Número do bot inválido, '${botNumber}', deve estar entre 1 e ${SPECS.MAX_PLAYERS}`);
        this.name = 'ErrBotInvalidNumber';
        Object.setPrototypeOf(this, ErrBotInvalidNumber.prototype);
    }
}

// ENV

export class ErrEnvNeedToken extends Error {
    constructor() {
        super('Partida no modo seguro requer um token válido');
        this.name = 'ErrEnvNeedToken';
        Object.setPrototypeOf(this, ErrEnvNeedToken.prototype);
    }
}

export class ErrFormationPlayerPositionNotDefined extends Error {
    constructor(playerNumber: number) {
        super(`A posição do jogador ${playerNumber} não foi definida`);
        this.name = 'ErrFormationPlayerPositionNotDefined';
        Object.setPrototypeOf(this, ErrFormationPlayerPositionNotDefined.prototype);
    }
}

export class ErrFormationInvalidPlayerNumber extends Error {
    constructor(playerNumber: number) {
        super(`Número do jogador inválido: ${playerNumber}`);
        this.name = 'ErrFormationInvalidPlayerNumber';
        Object.setPrototypeOf(this, ErrFormationInvalidPlayerNumber.prototype);
    }
}

export class ErrFormationInvalidKey extends Error {
    constructor(key: string) {
        super(`Chave inválida para a formação: ${key}, deve ser um número entre 1 e ${SPECS.MAX_PLAYERS}`);
        this.name = 'ErrFormationInvalidKey';
        Object.setPrototypeOf(this, ErrFormationInvalidKey.prototype);
    }
}

export class ErrFormationInvalidPosition extends Error {
    constructor(playerNumber: number) {
        super(`Posição inválida para o jogador ${playerNumber}: deve ser um array com 2 números.`);
        this.name = 'ErrFormationInvalidPosition';
        Object.setPrototypeOf(this, ErrFormationInvalidPosition.prototype);
    }
}

export class ErrFormationInvalidType extends Error {
    constructor(type: string) {
        super(`Tipo inválido para a formação: ${type}`);
        this.name = 'ErrFormationInvalidType';
        Object.setPrototypeOf(this, ErrFormationInvalidType.prototype);
    }
}

// MAPPER

export class ErrMapperColsOutOfRange extends Error {
    constructor(cols: number, minCols: number, maxCols: number) {
        super(`Número de colunas inválido: ${cols}, deve estar entre ${minCols} e ${maxCols}`);
        this.name = 'MapperColsOutOfRangeError';
        Object.setPrototypeOf(this, ErrMapperColsOutOfRange.prototype);
    }
}

export class ErrMapperRowsOutOfRange extends Error {
    constructor(rows: number, minRows: number, maxRows: number) {
        super(`Número de linhas inválido: ${rows}, deve estar entre ${minRows} e ${maxRows}`);
        this.name = 'MapperRowsOutOfRangeError';
        Object.setPrototypeOf(this, ErrMapperRowsOutOfRange.prototype);
    }
}

export class ErrMapperRowOutOfMapped extends Error {
    constructor(row: number, minRows: number, maxRows: number) {
        super(`Linha fora do mapeamento: ${row}, deve estar entre ${minRows} e ${maxRows}`);
        this.name = 'ErrMapperRowOutOfMapped';
        Object.setPrototypeOf(this, ErrMapperRowOutOfMapped.prototype);
    }
}

export class ErrMapperColOutOfMapped extends Error {
    constructor(col: number, minCols: number, maxCols: number) {
        super(`Coluna fora do mapeamento: ${col}, deve estar entre ${minCols} e ${maxCols}`);
        this.name = 'ErrMapperColOutOfMapped';
        Object.setPrototypeOf(this, ErrMapperColOutOfMapped.prototype);
    }
}

// SIDE

export class ErrSideInvalid extends Error {
    constructor(value: string | number) {
        super(`Valor inválido para o lado do time: '${value}'`);
        this.name = 'ErrSideInvalid';
        Object.setPrototypeOf(this, ErrSideInvalid.prototype);
    }
}

// PLAYER

export class ErrPlayerInvalidState extends Error {
    constructor(value: string | number) {
        super(`Valor inválido para o estado do jogador: '${value}'`);
        this.name = 'ErrPlayerInvalidState';
        Object.setPrototypeOf(this, ErrPlayerInvalidState.prototype);
    }
}

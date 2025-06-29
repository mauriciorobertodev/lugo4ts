import { Side } from '@/index.js';
import { expect, test } from 'vitest';

import {
    ErrBallNotFound,
    ErrBotInvalidNumber,
    ErrEnvNeedToken,
    ErrFormationInvalidKey,
    ErrFormationInvalidPlayerNumber,
    ErrFormationInvalidPosition,
    ErrFormationInvalidType,
    ErrFormationMapperNotDefined,
    ErrFormationPlayerPositionNotDefined,
    ErrGameInvalidPlayerState,
    ErrJumpZeroDirection,
    ErrKickZeroDirection,
    ErrMapperColOutOfMapped,
    ErrMapperColsOutOfRange,
    ErrMapperRowOutOfMapped,
    ErrMapperRowsOutOfRange,
    ErrMathInterpolationFactor,
    ErrMoveZeroDirection,
    ErrPlayerInvalidState,
    ErrPlayerNotFound,
    ErrSideInvalid,
    ErrTeamDuplicatePlayer,
    ErrTeamEmpty,
    ErrTeamInvalidScore,
    ErrTeamInvalidSide,
    ErrTeamNotFound,
} from '@/errors.js';

test('ErrPlayerNotFound', () => {
    const error = new ErrPlayerNotFound(Side.HOME, 10);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrPlayerNotFound);
    expect(error.name).toBe('ErrPlayerNotFound');
    expect(error.message).toBe('Team on side home does not have player 10');
    expect(error.side).toBe(Side.HOME);
    expect(error.number).toBe(10);
});

test('ErrBallNotFound', () => {
    const error = new ErrBallNotFound();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrBallNotFound);
    expect(error.name).toBe('ErrBallNotFound');
    expect(error.message).toBe('Ball not found');
});

test('ErrTeamNotFound', () => {
    const error = new ErrTeamNotFound(Side.AWAY);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrTeamNotFound);
    expect(error.name).toBe('ErrTeamNotFound');
    expect(error.message).toBe('Time não encontrado para o lado away');
});

test('ErrMoveZeroDirection', () => {
    const error = new ErrMoveZeroDirection();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrMoveZeroDirection);
    expect(error.name).toBe('ErrMoveZeroDirection');
    expect(error.message).toBe('Cannot move in zero direction');
});

test('ErrKickZeroDirection', () => {
    const error = new ErrKickZeroDirection();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrKickZeroDirection);
    expect(error.name).toBe('ErrKickZeroDirection');
    expect(error.message).toBe('Cannot kick in zero direction');
});

test('ErrJumpZeroDirection', () => {
    const error = new ErrJumpZeroDirection();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrJumpZeroDirection);
    expect(error.name).toBe('ErrJumpZeroDirection');
    expect(error.message).toBe('Cannot jump in zero direction');
});

test('ErrBotInvalidNumber', () => {
    const error = new ErrBotInvalidNumber('12');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrBotInvalidNumber);
    expect(error.name).toBe('ErrBotInvalidNumber');
    expect(error.message).toBe("Número do bot inválido, '12', deve estar entre 1 e 11");
});

test('ErrEnvNeedToken', () => {
    const error = new ErrEnvNeedToken();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrEnvNeedToken);
    expect(error.name).toBe('ErrEnvNeedToken');
    expect(error.message).toBe('Partida no modo seguro requer um token válido');
});

test('ErrFormationPlayerPositionNotDefined', () => {
    const error = new ErrFormationPlayerPositionNotDefined(5);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrFormationPlayerPositionNotDefined);
    expect(error.name).toBe('ErrFormationPlayerPositionNotDefined');
    expect(error.message).toBe('A posição do jogador 5 não foi definida');
});

test('ErrFormationInvalidPlayerNumber', () => {
    const error = new ErrFormationInvalidPlayerNumber(15);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrFormationInvalidPlayerNumber);
    expect(error.name).toBe('ErrFormationInvalidPlayerNumber');
    expect(error.message).toBe('Número do jogador inválido: 15');
});

test('ErrFormationInvalidKey', () => {
    const error = new ErrFormationInvalidKey('abc');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrFormationInvalidKey);
    expect(error.name).toBe('ErrFormationInvalidKey');
    expect(error.message).toBe('Chave inválida para a formação: abc, deve ser um número entre 1 e 11');
});

test('ErrFormationInvalidPosition', () => {
    const error = new ErrFormationInvalidPosition(3);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrFormationInvalidPosition);
    expect(error.name).toBe('ErrFormationInvalidPosition');
    expect(error.message).toBe('Posição inválida para o jogador 3: deve ser um array com 2 números.');
});

test('ErrFormationInvalidType', () => {
    const error = new ErrFormationInvalidType('invalid');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrFormationInvalidType);
    expect(error.name).toBe('ErrFormationInvalidType');
    expect(error.message).toBe('Tipo inválido para a formação: invalid');
});

test('ErrFormationMapperNotDefined', () => {
    const error = new ErrFormationMapperNotDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrFormationMapperNotDefined);
    expect(error.name).toBe('ErrFormationMapperNotDefined');
    expect(error.message).toBe('Mapper não definido para a formação');
});

test('ErrMapperColsOutOfRange', () => {
    const error = new ErrMapperColsOutOfRange(20, 1, 10);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrMapperColsOutOfRange);
    expect(error.name).toBe('MapperColsOutOfRangeError');
    expect(error.message).toBe('Número de colunas inválido: 20, deve estar entre 1 e 10');
});

test('ErrMapperRowsOutOfRange', () => {
    const error = new ErrMapperRowsOutOfRange(15, 1, 8);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrMapperRowsOutOfRange);
    expect(error.name).toBe('MapperRowsOutOfRangeError');
    expect(error.message).toBe('Número de linhas inválido: 15, deve estar entre 1 e 8');
});

test('ErrMapperRowOutOfMapped', () => {
    const error = new ErrMapperRowOutOfMapped(12, 0, 10);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrMapperRowOutOfMapped);
    expect(error.name).toBe('ErrMapperRowOutOfMapped');
    expect(error.message).toBe('Linha fora do mapeamento: 12, deve estar entre 0 e 10');
});

test('ErrMapperColOutOfMapped', () => {
    const error = new ErrMapperColOutOfMapped(8, 0, 5);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrMapperColOutOfMapped);
    expect(error.name).toBe('ErrMapperColOutOfMapped');
    expect(error.message).toBe('Coluna fora do mapeamento: 8, deve estar entre 0 e 5');
});

test('ErrSideInvalid', () => {
    const error = new ErrSideInvalid('invalid');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrSideInvalid);
    expect(error.name).toBe('ErrSideInvalid');
    expect(error.message).toBe("Valor inválido para o lado do time: 'invalid'");
});

test('ErrPlayerInvalidState', () => {
    const error = new ErrPlayerInvalidState('unknown');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrPlayerInvalidState);
    expect(error.name).toBe('ErrPlayerInvalidState');
    expect(error.message).toBe("Valor inválido para o estado do jogador: 'unknown'");
});

test('ErrTeamInvalidSide', () => {
    const error = new ErrTeamInvalidSide(7, Side.HOME);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrTeamInvalidSide);
    expect(error.name).toBe('ErrTeamInvalidSide');
    expect(error.message).toBe('Jogador 7 não pertence ao time do lado home');
});

test('ErrTeamDuplicatePlayer', () => {
    const error = new ErrTeamDuplicatePlayer(4);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrTeamDuplicatePlayer);
    expect(error.name).toBe('ErrTeamDuplicatePlayer');
    expect(error.message).toBe('Jogador 4 já existe no time.');
});

test('ErrTeamInvalidScore', () => {
    const error = new ErrTeamInvalidScore(-1);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrTeamInvalidScore);
    expect(error.name).toBe('ErrTeamInvalidScore');
    expect(error.message).toBe('Pontuação inválida: -1. A pontuação não pode ser negativa.');
});

test('ErrTeamEmpty', () => {
    const error = new ErrTeamEmpty();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrTeamEmpty);
    expect(error.name).toBe('ErrTeamEmpty');
    expect(error.message).toBe('O time não tem nenhum jogador.');
});

test('ErrMathInterpolationFactor', () => {
    const error = new ErrMathInterpolationFactor(1.5);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrMathInterpolationFactor);
    expect(error.name).toBe('ErrMathInterpolationFactor');
    expect(error.message).toBe('O fator de interpolação deve estar entre 0 e 1, recebido: 1.5');
});

test('ErrGameInvalidPlayerState', () => {
    const error = new ErrGameInvalidPlayerState('invalid');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrGameInvalidPlayerState);
    expect(error.name).toBe('ErrGameInvalidPlayerState');
    expect(error.message).toBe("Estado de jogador inválido: 'invalid'");
});

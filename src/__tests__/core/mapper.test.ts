import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { Env, Mapper, Point, SPECS, Side } from '@/core.js';

import {
    ErrMapperColOutOfMapped,
    ErrMapperColsOutOfRange,
    ErrMapperRowOutOfMapped,
    ErrMapperRowsOutOfRange,
} from '@/errors.js';

describe('Core/Mapper', () => {
    test('DEVE definir e retornar as colunas e linhas corretamente', () => {
        const mapper = new Mapper(10, 8, Side.HOME);

        expect(mapper.getCols()).toEqual(10);
        expect(mapper.getRows()).toEqual(8);
        expect(mapper.getSide()).toEqual(Side.HOME);

        mapper.setCols(22).setRows(33);
        expect(mapper.getCols()).toEqual(22);
        expect(mapper.getRows()).toEqual(33);
    });

    test('DEVE retornar a largura e altura das regiões', () => {
        const mapper = new Mapper(10, 10, Side.HOME);

        expect(mapper.getRegionWidth()).toEqual(SPECS.MAX_X_COORDINATE / 10);
        expect(mapper.getRegionHeight()).toEqual(SPECS.MAX_Y_COORDINATE / 10);

        mapper.setCols(22).setRows(33);
        expect(mapper.getRegionWidth()).toEqual(SPECS.MAX_X_COORDINATE / 22);
        expect(mapper.getRegionHeight()).toEqual(SPECS.MAX_Y_COORDINATE / 33);
    });

    test('DEVE retornar a região correta dado as coordenadas', () => {
        let mapper = new Mapper(10, 10, Side.HOME);
        let region = mapper.getRegion(1, 2);

        expect(region.getCol()).toEqual(1);
        expect(region.getRow()).toEqual(2);

        mapper = new Mapper(10, 10, Side.AWAY);
        region = mapper.getRegion(4, 9);

        expect(region.getCol()).toEqual(4);
        expect(region.getRow()).toEqual(9);
    });

    test('DEVE retornar um região aleatória do mapper, sem ultrapassar os limites definidos', () => {
        const cols = 20;
        const rows = 15;

        const mapper = new Mapper(cols, rows, Side.HOME);

        for (let i = 0; i < 1000; i++) {
            const region = mapper.getRandomRegion();

            expect(region.getCol()).toBeLessThanOrEqual(cols);
            expect(region.getRow()).toBeLessThanOrEqual(rows);
            expect(region.getCol()).toBeGreaterThanOrEqual(0);
            expect(region.getRow()).toBeGreaterThanOrEqual(0);
        }
    });

    test('DEVE retornar uma região onde se encontra o ponto dado', () => {
        let mapper = new Mapper(10, 10, Side.HOME);

        let region = mapper.getRegionFromPoint(new Point(0, 0));
        expect(region.getCol()).toEqual(0);
        expect(region.getRow()).toEqual(0);

        region = mapper.getRegionFromPoint(new Point(100, 100));
        expect(region.getCol()).toEqual(0);
        expect(region.getRow()).toEqual(0);

        region = mapper.getRegionFromPoint(new Point(5000, 4000));
        expect(region.getCol()).toEqual(2);
        expect(region.getRow()).toEqual(4);

        // o campo se inverte mas o 0x0 sempre é a esquerda do jogador em direção ao gol adversário como é quando está do lado HOME
        mapper = new Mapper(10, 10, Side.AWAY);

        region = mapper.getRegionFromPoint(new Point(0, 0));
        expect(region.getCol()).toEqual(9);
        expect(region.getRow()).toEqual(9);

        region = mapper.getRegionFromPoint(new Point(100, 100));
        expect(region.getCol()).toEqual(9);
        expect(region.getRow()).toEqual(9);

        region = mapper.getRegionFromPoint(new Point(5000, 4000));
        expect(region.getCol()).toEqual(7);
        expect(region.getRow()).toEqual(6);
    });

    test('DEVE estourar erros ao tentar definir um mapper muito pequeno ou muito grande', () => {
        expect(() => new Mapper(3, 10, Side.HOME)).toThrow(ErrMapperColsOutOfRange);
        expect(() => new Mapper(201, 10, Side.HOME)).toThrow(ErrMapperColsOutOfRange);
        expect(() => new Mapper(10, 1, Side.HOME)).toThrow(ErrMapperRowsOutOfRange);
        expect(() => new Mapper(10, 101, Side.HOME)).toThrow(ErrMapperRowsOutOfRange);
    });

    test('DEVE estourar erros ao tentar pegar uma região fora dos limites mapeados', () => {
        const mapper = new Mapper(10, 10, Side.HOME);

        expect(() => mapper.getRegion(-1, 0)).toThrow(ErrMapperColOutOfMapped);
        expect(() => mapper.getRegion(0, -1)).toThrow(ErrMapperRowOutOfMapped);
        expect(() => mapper.getRegion(11, 10)).toThrow(ErrMapperColOutOfMapped);
        expect(() => mapper.getRegion(10, 11)).toThrow(ErrMapperRowOutOfMapped);
    });
});

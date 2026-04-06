import { Mapper, Point, SPECS, Side } from "@/index.js";
import { describe, expect, test } from "vitest";

import { ErrMapperColOutOfMapped, ErrMapperColsOutOfRange, ErrMapperRowOutOfMapped, ErrMapperRowsOutOfRange } from "@/errors.js";

describe("Core/Mapper", () => {
	test("Getters e Setters", () => {
		const mapper = new Mapper(10, 8);

		expect(mapper.getCols()).toEqual(10);
		expect(mapper.getRows()).toEqual(8);
		expect(mapper.getViewSide()).toEqual(Side.HOME);

		expect(mapper.setViewSide(Side.AWAY)).toEqual(mapper);
		expect(mapper.getViewSide()).toEqual(Side.AWAY);

		expect(mapper.setCols(12)).toEqual(mapper);
		expect(mapper.getCols()).toEqual(12);

		expect(mapper.setRows(15)).toEqual(mapper);
		expect(mapper.getRows()).toEqual(15);
	});

	test("DEVE definir e retornar as colunas e linhas corretamente", () => {
		const mapper = new Mapper(10, 8);

		expect(mapper.getCols()).toEqual(10);
		expect(mapper.getRows()).toEqual(8);
		expect(mapper.getViewSide()).toEqual(Side.HOME);

		mapper.setCols(22).setRows(33);
		expect(mapper.getCols()).toEqual(22);
		expect(mapper.getRows()).toEqual(33);
	});

	test("DEVE retornar a largura e altura das regiões", () => {
		const mapper = new Mapper(10, 10);

		expect(mapper.getRegionWidth()).toEqual(SPECS.MAX_X_COORDINATE / 10);
		expect(mapper.getRegionHeight()).toEqual(SPECS.MAX_Y_COORDINATE / 10);

		mapper.setCols(22).setRows(33);
		expect(mapper.getRegionWidth()).toEqual(SPECS.MAX_X_COORDINATE / 22);
		expect(mapper.getRegionHeight()).toEqual(SPECS.MAX_Y_COORDINATE / 33);
	});

	test("DEVE retornar a região correta dado as coordenadas", () => {
		let mapper = new Mapper(10, 10);
		let region = mapper.getRegion(1, 2);

		expect(region.getCol()).toEqual(1);
		expect(region.getRow()).toEqual(2);

		mapper = new Mapper(10, 10);
		mapper.setViewSide(Side.AWAY);
		region = mapper.getRegion(4, 9);

		expect(region.getCol()).toEqual(4);
		expect(region.getRow()).toEqual(9);
	});

	test("DEVE retornar um região aleatória do mapper, sem ultrapassar os limites definidos", () => {
		const cols = 20;
		const rows = 15;

		const mapper = new Mapper(cols, rows);

		for (let i = 0; i < 1000; i++) {
			const region = mapper.getRandomRegion();

			expect(region.getCol()).toBeLessThanOrEqual(cols);
			expect(region.getRow()).toBeLessThanOrEqual(rows);
			expect(region.getCol()).toBeGreaterThanOrEqual(0);
			expect(region.getRow()).toBeGreaterThanOrEqual(0);
		}
	});

	test("DEVE retornar uma região onde se encontra o ponto dado", () => {
		let mapper = new Mapper(10, 10);

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
		mapper = new Mapper(10, 10);

		// 20_000 / 10; // 2000
		// 10_000 / 10; // 1000

		region = mapper.getRegionFromPoint(new Point(0, 0));
		expect(region.getCol()).toEqual(0);
		expect(region.getRow()).toEqual(0);

		region = mapper.getRegionFromPoint(new Point(2001, 1001));
		expect(region.getCol()).toEqual(1);
		expect(region.getRow()).toEqual(1);

		region = mapper.getRegionFromPoint(new Point(5000, 4000));
		expect(region.getCol()).toEqual(2);
		expect(region.getRow()).toEqual(4);
	});

	test("DEVE estourar erros ao tentar definir um mapper muito pequeno ou muito grande", () => {
		expect(() => new Mapper(3, 10)).toThrow(ErrMapperColsOutOfRange);
		expect(() => new Mapper(201, 10)).toThrow(ErrMapperColsOutOfRange);
		expect(() => new Mapper(10, 1)).toThrow(ErrMapperRowsOutOfRange);
		expect(() => new Mapper(10, 101)).toThrow(ErrMapperRowsOutOfRange);
	});

	test("DEVE estourar erros ao tentar pegar uma região fora dos limites mapeados", () => {
		const mapper = new Mapper(10, 10);

		expect(() => mapper.getRegion(-1, 0)).toThrow(ErrMapperColOutOfMapped);
		expect(() => mapper.getRegion(0, -1)).toThrow(ErrMapperRowOutOfMapped);
		expect(() => mapper.getRegion(10, 9)).toThrow(ErrMapperColOutOfMapped);
		expect(() => mapper.getRegion(9, 10)).toThrow(ErrMapperRowOutOfMapped);
	});
});

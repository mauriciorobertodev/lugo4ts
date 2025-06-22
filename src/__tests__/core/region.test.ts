import { describe, expect, test } from 'vitest';

import { Mapper, Player, Side, Vector2D, Velocity } from '@/core.js';
import { Point } from '@/core/point.js';

describe('Core/Region', () => {
    test('DEVE retornar a coluna e linha da região', function () {
        const mapper = new Mapper(10, 10, Side.HOME);
        const region = mapper.getRegion(3, 4);

        expect(region.getCol()).toEqual(3);
        expect(region.getRow()).toEqual(4);
    });

    test('DEVE retornar se a região é igual a outra', function () {
        const mapper = new Mapper(10, 10, Side.HOME);
        const regionA = mapper.getRegion(3, 4);
        const regionB = mapper.getRegion(4, 6);
        const regionC = mapper.getRegion(3, 4);

        expect(regionA.is(regionB)).toBe(false);
        expect(regionA.eq(regionB)).toBe(false);

        expect(regionA.is(regionC)).toBe(true);
        expect(regionA.eq(regionC)).toBe(true);

        expect(regionB.is(regionC)).toBe(false);
        expect(regionB.eq(regionC)).toBe(false);
    });

    test('DEVE retornar o ponto central da região', function () {
        let mapper = new Mapper(10, 10, Side.HOME);

        let region = mapper.getRegion(0, 0);
        let center = region.getCenter();
        expect(center.getX()).toEqual(1000);
        expect(center.getY()).toEqual(500);

        region = mapper.getRegion(4, 4);
        center = region.getCenter();
        expect(center.getX()).toEqual(9000);
        expect(center.getY()).toEqual(4500);

        mapper = new Mapper(10, 10, Side.AWAY);

        region = mapper.getRegion(0, 0);
        center = region.getCenter();
        expect(center.getX()).toEqual(19000);
        expect(center.getY()).toEqual(9500);

        region = mapper.getRegion(4, 4);
        center = region.getCenter();
        expect(center.getX()).toEqual(11000);
        expect(center.getY()).toEqual(5500);
    });

    test('DEVE retornar as regiões ao redor', function () {
        let mapper = new Mapper(10, 10, Side.HOME);

        let region = mapper.getRegion(5, 5);

        const front = region.front();
        expect(front.getCol()).toEqual(6);
        expect(front.getRow()).toEqual(5);

        const back = region.back();
        expect(back.getCol()).toEqual(4);
        expect(back.getRow()).toEqual(5);

        const left = region.left();
        expect(left.getCol()).toEqual(5);
        expect(left.getRow()).toEqual(4);

        const right = region.right();
        expect(right.getCol()).toEqual(5);
        expect(right.getRow()).toEqual(6);

        const frontRight = region.frontRight();
        expect(frontRight.getCol()).toEqual(6);
        expect(frontRight.getRow()).toEqual(6);

        const frontLeft = region.frontLeft();
        expect(frontLeft.getCol()).toEqual(6);
        expect(frontLeft.getRow()).toEqual(4);

        const backRight = region.backRight();
        expect(backRight.getCol()).toEqual(4);
        expect(backRight.getRow()).toEqual(6);

        const backLeft = region.backLeft();
        expect(backLeft.getCol()).toEqual(4);
        expect(backLeft.getRow()).toEqual(4);
    });

    test('DEVE um Point com as coordenadas da região', function () {
        const mapper = new Mapper(10, 10, Side.HOME);
        const region = mapper.getRandomRegion();
        const point = region.coordinates();

        expect(region.getCol()).toEqual(point.getX());
        expect(region.getRow()).toEqual(point.getY());
    });

    test('DEVE retornar as coordenadas quando for usado em string', function () {
        const mapper = new Mapper(10, 10, Side.HOME);
        const region = mapper.getRegion(7, 8);
        const string = region.toString();

        expect(string).toEqual('[7, 8]');
    });

    test('DEVE retornar a distância entre regiões', function () {
        let mapper = new Mapper(10, 10, Side.HOME);

        let regionA = mapper.getRegion(0, 0);
        let regionB = mapper.getRegion(3, 4);
        expect(regionA.distanceToRegion(regionB)).toEqual(5);

        regionA = mapper.getRegion(1, 6);
        regionB = mapper.getRegion(5, 9);
        expect(regionA.distanceToRegion(regionB)).toEqual(5);

        regionA = mapper.getRegion(7, 2);
        regionB = mapper.getRegion(3, 5);
        expect(regionA.distanceToRegion(regionB)).toEqual(5);

        mapper = new Mapper(10, 10, Side.AWAY);

        regionA = mapper.getRegion(0, 0);
        regionB = mapper.getRegion(3, 4);
        expect(regionA.distanceToRegion(regionB)).toEqual(5);

        regionA = mapper.getRegion(1, 6);
        regionB = mapper.getRegion(5, 9);
        expect(regionA.distanceToRegion(regionB)).toEqual(5);

        regionA = mapper.getRegion(7, 2);
        regionB = mapper.getRegion(3, 5);
        expect(regionA.distanceToRegion(regionB)).toEqual(5);
    });

    test('DEVE retornar a distância entre o centro da região e um ponto', function () {
        const mapper = new Mapper(10, 10, Side.HOME);

        let regionA = mapper.getRegion(0, 0);
        let regionB = mapper.getRegion(4, 4);
        expect(regionA.distanceToPoint(regionB.getCenter())).toEqual(8944.27190999916);

        regionA = mapper.getRegion(1, 6);
        regionB = mapper.getRegion(5, 9);
        expect(regionA.distanceToPoint(regionB.getCenter())).toEqual(8544.003745317532);

        regionA = mapper.getRegion(7, 2);
        regionB = mapper.getRegion(3, 5);
        expect(regionA.distanceToPoint(regionB.getCenter())).toEqual(8544.003745317532);
    });

    test('DEVE retornar se o player x está dentro da região', function () {
        const mapper = new Mapper(10, 10, Side.HOME);
        const player = new Player(
            1,
            false,
            Side.HOME,
            new Point(500, 600),
            new Point(),
            new Velocity(new Vector2D(), 100)
        );

        const regionA = mapper.getRegion(0, 0);
        expect(regionA.containsPlayer(player)).toBe(true);
        const regionB = mapper.getRegion(4, 4);
        expect(regionB.containsPlayer(player)).toBe(false);
    });
});

import { expect, test } from 'vitest';

import { Point as LugoPoint, Vector as LugoVector } from '@/generated/physics.js';

import { Point } from '@/core.js';

import { randomPoint, randomVector2D } from '@/utils.js';

import { fromLugoPoint, toLugoPoint, toLugoVector } from '@/lugo.js';

test('DEVE criar um novo Point com base em um LugoPoint e ter os mesmos dados', () => {
    const lp = toLugoPoint(randomPoint());
    const lv = toLugoVector(randomVector2D());

    let pos1 = fromLugoPoint(lp);

    expect(pos1).toBeInstanceOf(Point);
    expect(pos1.getX()).toBe(lp.x);
    expect(pos1.getY()).toBe(lp.y);

    pos1 = fromLugoPoint(lp);

    expect(pos1).toBeInstanceOf(Point);
    expect(pos1.getX()).toBe(lp.x);
    expect(pos1.getY()).toBe(lp.y);

    pos1 = fromLugoPoint(lp);

    expect(pos1).toBeInstanceOf(Point);
    expect(pos1.getX()).toBe(lp.x);
    expect(pos1.getY()).toBe(lp.y);
});

test('DEVE retornar um LugoPoint com mesmos dados', () => {
    let pos = new Point(500, 200);
    let lp = toLugoPoint(pos);

    expect(typeof lp).toBe(typeof LugoPoint);
    expect(lp.x).toBe(pos.getX());
    expect(lp.y).toBe(pos.getY());

    pos = new Point(500.55, 200.66);
    lp = toLugoPoint(pos);

    expect(typeof lp).toBe(typeof LugoPoint);
    expect(lp.x).toBe(Math.round(pos.getX()));
    expect(lp.y).toBe(Math.round(pos.getY()));
    expect(lp.x).toBe(501);
    expect(lp.y).toBe(201);
});

test('DEVE retornar um LugoVector com mesmos dados', () => {
    let pos = new Point(500, 200);
    let vector = toLugoVector(pos);

    // expect(vector).toBeInstanceOf(LugoVector);
    expect(typeof vector).toBe(typeof LugoVector);
    expect(vector.x).toBe(pos.getX());
    expect(vector.y).toBe(pos.getY());

    pos = new Point(500.55, 200.66);
    vector = toLugoVector(pos);

    expect(typeof vector).toBe(typeof LugoVector);
    expect(vector.x).toBeCloseTo(pos.getX());
    expect(vector.y).toBeCloseTo(pos.getY());
});

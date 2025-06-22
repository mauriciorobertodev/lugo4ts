import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { Env, Side } from '@/core.js';

import { ErrBotInvalidNumber, ErrEnvNeedToken } from '@/errors.js';

describe('Core/Env', () => {
    beforeEach(() => {
        process.env.BOT_GRPC_URL = 'localhost:5000';
        process.env.BOT_GRPC_INSECURE = 'true';
        process.env.BOT_TEAM = 'home';
        process.env.BOT_NUMBER = '5';
        process.env.BOT_TOKEN = 'my_secret_token';
    });

    afterEach(() => {
        delete process.env.BOT_GRPC_URL;
        delete process.env.BOT_GRPC_INSECURE;
        delete process.env.BOT_TEAM;
        delete process.env.BOT_NUMBER;
        delete process.env.BOT_TOKEN;
    });

    test('DEVE ser construído com os valores corretos', () => {
        const env = new Env();
        expect(env.getGrpcUrl()).toBe('localhost:5000');
        expect(env.getGrpcInsecure()).toBe(true);
        expect(env.getBotSide()).toBe(Side.HOME);
        expect(env.getBotNumber()).toBe(5);
        expect(env.getBotToken()).toBe('my_secret_token');
    });

    test('DEVE lançar um erro com um número de bot inválido', () => {
        process.env.BOT_NUMBER = '999';
        expect(() => new Env()).toThrowError(ErrBotInvalidNumber);
    });

    test('DEVE definir as propriedades padrões e erro nas que não existem um padrão', () => {
        process.env.BOT_GRPC_URL = '';
        process.env.BOT_GRPC_INSECURE = '';
        let env = new Env();
        expect(env.getGrpcUrl()).toBe('localhost:5000');
        expect(env.getGrpcInsecure()).toBe(true);

        process.env.BOT_TEAM = '';
        expect(() => new Env()).toThrow();
        process.env.BOT_TEAM = 'invalid';
        expect(() => new Env()).toThrow();
        process.env.BOT_TEAM = 'home';

        process.env.BOT_NUMBER = '';
        expect(() => new Env()).toThrow();
        process.env.BOT_NUMBER = '12';
        expect(() => new Env()).toThrow();
        process.env.BOT_NUMBER = '10';

        process.env.BOT_GRPC_INSECURE = 'false';
        process.env.BOT_TOKEN = '';
        expect(() => new Env()).toThrowError(ErrEnvNeedToken);
    });
});

import { sleep } from '@/index.js';
import { describe, expect, test } from 'vitest';

describe('Utils/Time', () => {
    test('DEVE aguardar pelo tempo especificado', async () => {
        const start = Date.now();
        await sleep(100);
        const elapsed = Date.now() - start;
        // Permite uma margem de erro de 10ms
        expect(elapsed).toBeGreaterThanOrEqual(90);
        expect(elapsed).toBeLessThan(200);
    });
});

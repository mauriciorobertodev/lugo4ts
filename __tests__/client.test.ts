// src/__tests__/Client.test.ts
import { describe, it, expect } from 'vitest';
import { Client } from '../src/client';

describe('Client', () => {
  it('should create a client instance', () => {
    const client = new Client();
    expect(client).toBeInstanceOf(Client);
  });
});
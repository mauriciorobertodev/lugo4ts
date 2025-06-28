import { Side } from '@/core/side.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

// Estado interno
let _enabled = false;
let _playerNumber: number | undefined = undefined;
let _playerSide: Side | undefined = undefined;
let _playerState: string | undefined = undefined;

export function setLogPlayer({
    playerNumber,
    playerSide,
    playerState,
}: {
    playerNumber?: number;
    playerSide?: Side;
    playerState?: string;
}) {
    _playerNumber = playerNumber;
    _playerSide = playerSide;
    _playerState = playerState;
}

export function enableLogs() {
    _enabled = true;
}

export function disableLogs() {
    _enabled = false;
}

const colors = {
    reset: '\x1b[0m',
    debug: '\x1b[90m', // cinza
    info: '\x1b[34m', // azul
    success: '\x1b[32m', // verde
    warn: '\x1b[33m', // amarelo
    error: '\x1b[31m', // vermelho
};

function formatPrefix(): string {
    const parts = [
        _playerNumber !== undefined ? `[${_playerNumber}]` : null,
        _playerSide !== undefined ? `[${_playerSide}]` : null,
        _playerState !== undefined ? `[${_playerState.toUpperCase()}]` : null,
    ].filter(Boolean);
    return parts.join(' ');
}

function baseLog(level: LogLevel, msg: string) {
    if (!_enabled) return;

    const prefix = formatPrefix();
    const color = colors[level];
    const output = `${color}${prefix} ${msg}${colors.reset}`;
    console.log(output);
}

// Funções de log direto
export function debug(msg: string) {
    baseLog('debug', msg);
}

export function info(msg: string) {
    baseLog('info', msg);
}

export function success(msg: string) {
    baseLog('success', msg);
}

export function warn(msg: string) {
    baseLog('warn', msg);
}

export function error(msg: string) {
    baseLog('error', msg);
}

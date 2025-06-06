import { GameController } from '../../../src/core/controller.js';

const controller = new GameController('game_server:6000');

controller.setupEventListeners();

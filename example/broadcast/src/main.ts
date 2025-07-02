import { GameController } from '../../../src/core/game-controller.js';

const controller = new GameController('localhost:6000');

controller.setupEventListeners();

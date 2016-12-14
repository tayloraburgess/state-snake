/* eslint-env browser */

import factoryGame from './modules/game';

const SIZE = 25;
const PIXEL_SIZE = 20;
const FPS = 30;
const SPEED = 100;
const ID = 'game';

const game = factoryGame(ID, SIZE, PIXEL_SIZE, FPS, SPEED);
game.start();

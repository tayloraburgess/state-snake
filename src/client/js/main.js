/* eslint-env browser */

import factoryGame from './modules/game';

const args = {
  size: 25, // Game board is size tiles
  tilePixelSize: 20, // Width & height of game tiles
  fps: 10, // How many times per second the game will check for view updates
  speed: 100, // Interval between individual game states, in milliseconds
  id: 'game', // Game canvas tag id
};
const game = factoryGame(args);
game.start();

/* eslint-env browser */

import factoryStateController from './state-controller';
import factoryCanvas from './canvas';

const Game = {
  _updatedState: false, // Flag used by _renderLoop() to know if there is a new state to render
  _status: 'start', // Changes based on user actions--pauses, loss, etc
  _statusChange: false, // Flag set when _status shifts
  _keysPressed: [], // Holds all keys pressed between state changes
  _statusHeader: document.getElementById('status'), // DOM element that gives user information

  start() {
    // Only exposed function in module--starts the game.
    this._initialize();
    this._addListeners();
    setTimeout(this._gameLoop(), 0);
    setTimeout(this._renderLoop(), 0);
  },

  _initialize() {
    // Operations to create all necessary game structures--create first
    // state and render initial canvas. Can also be used to reset the game.
    this._stateController.initializeState('ArrowRight');
    this._canvas.firstRender(this._stateController.getStateForRender());
  },

  _addListeners() {
    // Adds necessary callbacks for game keypresses.
    document.addEventListener('keydown', (event) => {
      // 'Space' keypresses have a special handler, but all other
      // keypresses are stored--and handled in _newDirection()
      if (event.code === 'Space') {
        this._handleSpacePress();
      }
      this._keysPressed.push(event.code);
    });
  },

  _gameLoop() {
    // Main game loop--repeatedly calls callback at _speed interval,
    // propagating game state change and checking for game status changes.
    const callback = () => {
      if (this._statusChange) {
        if (this._status === 'start') {
          this._initialize();
        }
        this._handleStatusChange();
      }
      if (this._status === 'running') {
        this._run();
      }
    };
    setInterval(callback, this._speed);
  },

  _renderLoop() {
    // Checks for updates to the state at intervals, and prompts the
    // view to change if so.
    const callback = () => {
      if (this._updatedState) {
        this._canvas.render(this._stateController.getStateForRender());
        this._updatedState = false;
      }
    };
    setInterval(callback, this._fps);
  },

  _run() {
    // Called repeatedly while game _status is running. Checks user
    // input for a new direction for the snake to move in, and either
    // generates a new state or ends the game.
    const head = this._stateController.getSnakeHead();
    // The game grid is stored as a series of integers, rather than
    // a 2D matrix; so, based on the position of the snake head in
    // the last state, these are the possible new positions
    const possibleMoves = {
      ArrowUp: head - this._size,
      ArrowDown: head + this._size,
      ArrowLeft: head - 1,
      ArrowRight: head + 1,
    };
    const oldDirection = this._stateController.getDirection();
    const newDirection = this._getNewDirection(oldDirection, this._getAllowedKeys(oldDirection));
    this._clearKeys();
    // If the new snake head position, based on user input, collides with
    // a wall or itself, the game is lost; otherwise, use the new
    // position to update the state
    if (this._stateController.checkCollision(possibleMoves[newDirection])) {
      this._status = 'lost';
      this._statusChange = true;
    } else {
      this._stateController.updateState(newDirection, possibleMoves[newDirection]);
      this._updatedState = true;
    }
  },

  _clearKeys() {
    // Clears the list of keys stored since the last state change.
    this._keysPressed.splice(0, this._keysPressed.length);
  },

  _getAllowedKeys(direction) {
    // When the snake is moving up, the user should not be able to try
    // to move down; when left, not right; etc. So, based on an input snake
    // direction, return a list of valid keypresses.
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const notAllowed = {
      ArrowUp: keys.indexOf('ArrowDown'),
      ArrowDown: keys.indexOf('ArrowUp'),
      ArrowLeft: keys.indexOf('ArrowRight'),
      ArrowRight: keys.indexOf('ArrowLeft'),
    };
    keys.splice(notAllowed[direction], 1);
    return keys;
  },

  _getNewDirection(direction, allowedKeys) {
    // Determine whether the user has pressed a valid arrow key based
    // on the input list of allowed keys; otherwise, return the key direction.
    const keysPressed = this._keysPressed.slice();
    while (keysPressed.length > 0) {
      const key = keysPressed.pop();
      if (allowedKeys.indexOf(key) > -1) {
        return key;
      }
    }
    return direction;
  },

  _handleSpacePress() {
    // The space key allows the user to change the status of the
    // game--if running, space pauses, if the user has lost, space
    // resets. This function changes the status and signals via
    // _statusChange when it has.
    const statusChanges = {
      start: 'running',
      running: 'paused',
      paused: 'running',
      lost: 'start',
    };
    this._status = statusChanges[this._status];
    this._statusChange = true;
  },

  _handleStatusChange() {
    // Changes the status message visible to the user, and reverts the
    // _statusChange flag to indicate that it's done.
    const statusMessages = {
      start: 'press space to start',
      running: 'use the arrow keys to move<br>press space to pause',
      paused: 'paused!<br>press space to start again',
      lost: 'game over!<br>press space to reset',
    };
    this._changeStatusText(statusMessages[this._status]);
    this._statusChange = false;
  },

  _changeStatusText(text) {
    // Changes the HTML element displaying game status.
    this._statusHeader.innerHTML = text;
  },
};

function factoryGame(args) {
  const {
    id = 'game',
    size = 20,
    tilePixelSize = 20,
    fps = 30,
    speed = 150,
  } = args;
  return Object.assign(Object.create(Game), {
    _size: size, // size of game grid
    _speed: speed, // speed, in milliseconds, of _gameLoop()
    _stateController: factoryStateController(size), // module for interfacing with game State
    _canvas: factoryCanvas({ id, size, tilePixelSize }), // game view
    _fps: Math.round(1000 / fps), // Game calculates intervals in milliseconds, so convert
  });
}

export default factoryGame;

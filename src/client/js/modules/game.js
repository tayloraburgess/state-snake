/* eslint-env browser */

import factoryStateController from './state-controller';
import factoryCanvas from './canvas';

const Game = {
  _UP: 38,
  _DOWN: 40,
  _LEFT: 37,
  _RIGHT: 39,
  _updatedState: false,
  _keysPressed: [],
  _status: 'start',
  _statusChange: false,
  _statusHeader: document.getElementById('status'),
  start() {
    this._initialize();
    setTimeout(this._gameLoop(), 0);
    setTimeout(this._renderLoop(), 0);
  },
  _initialize() {
    this._stateController.initializeState(this._RIGHT);
    this._canvas.firstRender(this._stateController.getStateForRender());
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        this._handleSpacePress();
      }
      this._keysPressed.push(event.keyCode);
    });
    document.addEventListener('keydown', this._handleSpacePress);
  },
  _handleSpacePress() {
    switch (this._status) {
      case 'start':
        this._status = 'running';
        break;
      case 'running':
        this._status = 'paused';
        break;
      case 'paused':
        this._status = 'running';
        break;
      case 'lost':
        this._status = 'start';
        break;
      default:
        break;
    }
    this._statusChange = true;
  },
  _gameLoop() {
    const callback = () => {
      if (this._status === 'running') {
        const head = this._stateController.getSnakeHead();
        const possibleMoves = {
          [this._UP]: head - this._size,
          [this._DOWN]: head + this._size,
          [this._LEFT]: head - 1,
          [this._RIGHT]: head + 1,
        };
        const direction = this._getInput();
        this._clearInput();
        if (this._stateController.checkCollision(possibleMoves[direction])) {
          this._status = 'lost';
          this._statusChange = true;
        } else {
          this._stateController.updateState(direction, possibleMoves[direction]);
          this._updatedState = true;
        }
      }
      if (this._statusChange) {
        this._handleStatusChange();
      }
    };
    this.loopKey = setInterval(callback, this._speed);
  },
  _changeStatusText(text) {
    this._statusHeader.innerText = text;
  },
  _handleStatusChange() {
    switch (this._status) {
      case 'start':
        this._stateController.initializeState(this._RIGHT);
        this._updatedState = true;
        this._changeStatusText('press space to start');
        break;
      case 'running':
        this._changeStatusText('press space to pause');
        break;
      case 'paused':
        this._changeStatusText('paused! press space to start again');
        break;
      case 'lost':
        this._changeStatusText('you lost! press space to reset');
        break;
      default:
        break;
    }
    this._statusChange = false;
  },
  _renderLoop() {
    const callback = () => {
      if (this._updatedState) {
        this._canvas.render(this._stateController.getStateForRender());
        this._updatedState = false;
      }
    };
    setInterval(callback, this._fps);
  },
  _getAllowedKeys(direction) {
    const keys = [this._UP, this._DOWN, this._LEFT, this._RIGHT];
    const notAllowed = {
      [this._UP]: keys.indexOf(this._DOWN),
      [this._DOWN]: keys.indexOf(this._UP),
      [this._LEFT]: keys.indexOf(this._RIGHT),
      [this._RIGHT]: keys.indexOf(this._LEFT),
    };
    keys.splice(notAllowed[direction], 1);
    return keys;
  },
  _newDirection(direction, allowedKeys) {
    const keysPressed = this._keysPressed.slice();
    while (keysPressed.length > 0) {
      const key = keysPressed.pop();
      if (allowedKeys.indexOf(key) > -1) {
        return key;
      }
    }
    return direction;
  },
  _getInput() {
    const direction = this._stateController.getLastDirection();
    return this._newDirection(direction, this._getAllowedKeys(direction));
  },
  _clearInput() {
    this._keysPressed.splice(0, this._keysPressed.length);
  },
};

function factoryGame(id, size, tilePixelSize, fps, speed) {
  return Object.assign(Object.create(Game), {
    _size: size,
    _speed: speed,
    _stateController: factoryStateController(size),
    _canvas: factoryCanvas(id, size, tilePixelSize),
    _fps: Math.round(1000 / fps),
  });
}

export default factoryGame;

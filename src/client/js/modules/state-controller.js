/* eslint-env browser */

import factoryState from './state';

const StateController = {
  initializeState(direction) {
    this._state.resetStateHistory();
    this._state.newState(this._generateFirstState(direction));
  },
  updateState(direction, next) {
    this._state.newState(this._generateNewState(direction, next));
  },
  getStateForRender() {
    return {
      snake: this._state.getSnake(),
      food: this._state.getFood(),
      free: this._state.getFree(),
      walls: this._state.getWalls(),
    };
  },
  getSnakeHead() {
    return this._state.getSnake()[0];
  },
  getLastDirection() {
    return this._state.getDirection();
  },
  checkCollision(next) {
    if (this._state.getFree().indexOf(next) > -1) {
      return false;
    } else if (next === this._state.getFood()) {
      return false;
    }
    return true;
  },
  _generateFirstState(direction) {
    const tiles = Array.from({ length: this._size * this._size }, (v, k) => {
      return k;
    });
    const walls = [];
    const free = [];
    tiles.forEach((tile) => {
      if (this._tileIsWall(tile)) {
        walls.push(tile);
      } else {
        free.push(tile);
      }
    });
    const snake = [free.splice(Math.floor(Math.random() * free.length), 1)[0]];
    const food = free.splice(Math.floor(Math.random() * free.length), 1)[0];
    return {
      direction,
      snake,
      food,
      free,
      walls,
    };
  },
  _generateNewState(direction, next) {
    const newFood = this._generateNewFood(this._state.getFree());
    return {
      direction,
      snake: this._updateSnake(next, this._getOldState()),
      food: this._updateFood(next, newFood, this._getOldState()),
      free: this._updateFree(next, newFood, this._getOldState()),
      walls: this._state.getWalls(),
    };
  },
  _getOldState() {
    return {
      snake: this._state.getSnake(),
      food: this._state.getFood(),
      free: this._state.getFree(),
    };
  },
  _generateNewFood(free) {
    return free.splice(Math.floor(Math.random() * free.length), 1)[0];
  },
  _updateSnake(next, state) {
    const { snake, food, free } = state;
    const index = free.indexOf(next);
    if (index > -1) {
      snake.unshift(free[index]);
      snake.pop();
    } else if (next === food) {
      snake.unshift(food);
    }
    return snake;
  },
  _updateFood(next, newFood, state) {
    const { food } = state;
    if (next === food) {
      return newFood;
    }
    return food;
  },
  _updateFree(next, newFood, state) {
    const { snake, food, free } = state;
    const index = free.indexOf(next);
    if (index > -1) {
      free.splice(index, 1);
      free.push(snake.pop());
    } else if (next === food) {
      free.splice(free.indexOf(newFood), 1);
    }
    return free;
  },
  _tileIsWall(tile) {
    const topWall = tile < this._size;
    const bottomWall = tile > ((this._size * this._size) - this._size - 1);
    const leftWall = !(tile % this._size);
    const rightWall = !(((tile - this._size) + 1) % this._size);
    return topWall || bottomWall || leftWall || rightWall;
  },
};

function factoryStateController(size) {
  return Object.assign(Object.create(StateController), {
    _state: factoryState(),
    _size: size,
  });
}

export default factoryStateController;

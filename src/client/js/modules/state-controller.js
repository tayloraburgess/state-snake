/* eslint-env browser */

import factoryState from './state';

const StateController = {
  initializeState(direction) {
    // Based on an initial cardinal direction for the snake, resets
    // any existing state and generates an initial state.
    this._state.resetStateHistory();
    this._state.newState(this._generateFirstState(direction));
  },

  updateState(direction, next) {
    // Updates the state based on the snake's previous direction
    // and its next position.
    this._state.newState(this._generateNewState(direction, next));
  },

  getStateForRender() {
    // Returns an object specifically formatted for destructuring
    // by the Canvas view. (note: leaky abstraction that should probably
    // be fixed)
    return {
      snake: this._state.getSnake(),
      food: this._state.getFood(),
      free: this._state.getFree(),
      walls: this._state.getWalls(),
    };
  },

  getSnakeHead() {
    // Returns the first position in the snake's state.
    return this._state.getSnake()[0];
  },

  getDirection() {
    // Returns the snake's direction in the current state.
    return this._state.getDirection();
  },

  checkCollision(next) {
    // Based on the input next position for the snake, returns a boolean
    // for collision with a wall or the snake itself. The logic works in
    // inverse: it checks whether the snake's next position is
    // either a free space or food.
    if (this._state.getFree().indexOf(next) > -1) {
      return false;
    } else if (next === this._state.getFood()) {
      return false;
    }
    return true;
  },

  _generateFirstState(direction) {
    // From an input snake direction, generates a first game state.
    // First, generate an array of numbers, one for each tile in the game grid
    const tiles = Array.from({ length: this._size * this._size }, (v, k) => {
      return k;
    });
    // Second, assign all tiles to either the wall or free space lists
    const walls = [];
    const free = [];
    tiles.forEach((tile) => {
      if (this._tileIsWall(tile)) {
        walls.push(tile);
      } else {
        free.push(tile);
      }
    });
    // Third, randomly pull two tiles from the free space list, and assign
    // them to snake's first position, and the food
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

  _tileIsWall(tile) {
    // For module use when generating the initial state. If the input tile
    // is on any of the game board's borders, returns true.
    const topWall = tile < this._size;
    const bottomWall = tile > ((this._size * this._size) - this._size - 1);
    const leftWall = !(tile % this._size);
    const rightWall = !(((tile - this._size) + 1) % this._size);
    return topWall || bottomWall || leftWall || rightWall;
  },

  _generateNewState(direction, next) {
    // Generates a new game state from an input snake direction
    // and the snake's next position.
    // First, find a possible position for the food tile in the event
    // that it needs to change (i.e. the snake overlaps the old food)
    const newFood = this._generateNewFood(this._state.getFree());
    // Then, update the snake, food, and free tiles--update each separately
    // so the logic for each doesn't get confused--but pass each the
    // possible new position for the food because it is randomly, not
    // logically, generated
    return {
      direction,
      snake: this._updateSnake(next, this._getCurrentState()),
      food: this._updateFood(next, newFood, this._getCurrentState()),
      free: this._updateFree(next, newFood, this._getCurrentState()),
      walls: this._state.getWalls(),
    };
  },

  _getCurrentState() {
    // For ease of use within the module, returns a object containing
    // current state information, to be destructured in _updateFood(),
    // _updateFree(), etc.
    return {
      snake: this._state.getSnake(),
      food: this._state.getFood(),
      free: this._state.getFree(),
    };
  },

  _generateNewFood(free) {
    // Given an input list of free spaces, finds a random tile for the
    // food to occupy.
    return free.splice(Math.floor(Math.random() * free.length), 1)[0];
  },

  _updateSnake(next, state) {
    // Returns a new snake state based on the current input state
    // and the snake's next position.
    const { snake, food, free } = state;
    const index = free.indexOf(next);
    // If the snake's next position is a free tile, add the tile to the
    // snake, and remove one tile from its tail. If the next position is food,
    // do the same, but don't remove the tail, so the snake grows
    if (index > -1) {
      snake.unshift(free[index]);
      snake.pop();
    } else if (next === food) {
      snake.unshift(food);
    }
    return snake;
  },

  _updateFood(next, newFood, state) {
    // Given an input possible position for the food tile--newFood--
    // return a new food state at this position if snake's next
    // position is the current food tile.
    const { food } = state;
    if (next === food) {
      return newFood;
    }
    return food;
  },

  _updateFree(next, newFood, state) {
    // Generate a new free tile state based on the snake's
    // next position and whether or not the food tile will move
    // (which happens when the snake overlaps with it).
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
};

function factoryStateController(size) {
  return Object.assign(Object.create(StateController), {
    _state: factoryState(), // State object for controller to work with
    _size: size, // Size of game board
  });
}

export default factoryStateController;

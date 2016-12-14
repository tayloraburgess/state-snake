/* eslint-env browser */

const State = {
  _stateHistory: [], // List of games states; state at end of list is current

  resetStateHistory() {
    // Clears state history, returning it to an empty list.
    this._stateHistory.splice(0, this._stateHistory.length);
  },

  newState(args) {
    // Adds a new state to the state history from the input state object.
    // If necessary parts of the state are missing from the input, populate
    // the new state from the previous state.
    const {
      direction = this.getDirection(),
      snake = this.getSnake(),
      food = this.getFood(),
      free = this.getFree(),
      walls = this.getWalls(),
    } = args;
    const state = {
      direction,
      snake,
      food,
      free,
      walls,
    };
    this._stateHistory.push(state);
  },

  getWalls() {
    // Getter for walls in most recent state. Walls are a list of
    // integers representing game grid positions.
    return this._stateHistory[this._stateHistory.length - 1].walls.slice();
  },

  getFree() {
    // Getter for free spaces in most recent state. Free spaces are a list of
    // integers representing game grid positions.
    return this._stateHistory[this._stateHistory.length - 1].free.slice();
  },

  getSnake() {
    // Getter for snake in most recent state. The snake is a list of
    // integers representing game grid positions.
    return this._stateHistory[this._stateHistory.length - 1].snake.slice();
  },

  getFood() {
    // Getter for food in most recent state. Food is a single integer
    // representing a game grid position.
    return this._stateHistory[this._stateHistory.length - 1].food;
  },

  getDirection() {
    // Getter for snake direction in most recent state. Direction is a string
    // representing a directional key pressed by a user.
    return this._stateHistory[this._stateHistory.length - 1].direction;
  },
};

function factoryState() {
  return Object.create(State);
}

export default factoryState;

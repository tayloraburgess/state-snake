/* eslint-env browser */

const State = {
  _stateHistory: [],
  resetStateHistory() {
    this._stateHistory.splice(0, this._stateHistory.length);
  },
  newState(args) {
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
    return this._stateHistory[this._stateHistory.length - 1].walls.slice();
  },
  getFree() {
    return this._stateHistory[this._stateHistory.length - 1].free.slice();
  },
  getSnake() {
    return this._stateHistory[this._stateHistory.length - 1].snake.slice();
  },
  getFood() {
    return this._stateHistory[this._stateHistory.length - 1].food;
  },
  getDirection() {
    return this._stateHistory[this._stateHistory.length - 1].direction;
  },
};

function factoryState() {
  return Object.create(State);
}

export default factoryState;

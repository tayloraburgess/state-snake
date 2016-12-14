/* eslint-env browser */

const Canvas = {
  _BACKGROUND_COLOR: '#464646', // Internal module rendering constant
  _SNAKE_COLOR: '#00ffe5', // ...
  _FOOD_COLOR: '#acacac', // ...
  _WALL_COLOR: '#606060', // ...
  _buffer: document.createElement('canvas'), // Additional canvas for pre-rendering the view
  _snakeSprite: document.createElement('canvas'), // Canvas for pre-rendering game element
  _foodSprite: document.createElement('canvas'), // ...
  _wallSprite: document.createElement('canvas'), // ...
  _freeSprite: document.createElement('canvas'), // ...

  firstRender(args) {
    // Initializes the view canvas by pulling it from the DOM and
    // setting its properties. Then sets the same properties for the buffer
    // canvas and invokes the first canvas render.
    this._element = document.getElementById('game');
    const pixelSize = this._size * this._tilePixelSize;
    this._element.width = pixelSize;
    this._element.height = pixelSize;
    this._buffer.width = pixelSize;
    this._buffer.height = pixelSize;
    this._initializeSprites();
    this.render(args);
  },

  render(args) {
    // From an input object representing game state, iterates through the object's
    // properties, draws appropriate sprites to the buffer canvas by
    // calculating their pixel position, and draws the buffer canvas to
    // the display (element) canvas.
    const {
      snake = [],
      food = 0,
      free = [],
      walls = [],
    } = args;
    const ctx = this._buffer.getContext('2d');
    walls.forEach((tile) => {
      ctx.drawImage(this._wallSprite, this._calcX(tile), this._calcY(tile));
    });
    free.forEach((tile) => {
      ctx.drawImage(this._freeSprite, this._calcX(tile), this._calcY(tile));
    });
    snake.forEach((tile) => {
      ctx.drawImage(this._snakeSprite, this._calcX(tile), this._calcY(tile));
    });
    ctx.drawImage(this._foodSprite, this._calcX(food), this._calcY(food));
    const displayCtx = this._element.getContext('2d');
    displayCtx.drawImage(this._buffer, 0, 0);
  },

  _calcX(position) {
    // Calculates an object's pixel x coordinate based on its game state
    // representation--i.e. an integer less than the _size of the game.
    return (position % this._size) * this._tilePixelSize;
  },

  _calcY(position) {
    // See _calcX, but for pixel y coordinate.
    return Math.floor(position / this._size) * this._tilePixelSize;
  },

  _initializeSprites() {
    // Sets sprite canvas sizes, and pre-draws all sprites to their
    // separate canvases.
    this._setSpriteSize(this._snakeSprite);
    this._drawSnakeSprite();
    this._setSpriteSize(this._foodSprite);
    this._drawFoodSprite();
    this._setSpriteSize(this._freeSprite);
    this._drawFreeSprite();
    this._setSpriteSize(this._wallSprite);
    this._drawWallSprite();
  },

  _setSpriteSize(sprite) {
    // Sets input sprite canvas to game tile pixel size.
    sprite.width = this._tilePixelSize;
    sprite.height = this._tilePixelSize;
  },

  _drawSpriteBackground(sprite) {
    // Draws game background as a solid square on sprite canvas.
    this._drawSquare(sprite, 0, 0, sprite.width, this._BACKGROUND_COLOR);
  },

  _drawCircle(canvas, x, y, radius, color) {
    // Generic function to draw a filled circle to a canvas.
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  },

  _drawSquare(canvas, x, y, size, color) {
    // Generic function to draw a filled square to a canvas.
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(x, y, x + size, y + size);
  },

  _drawWallSprite() {
    // Pre-draws wall sprite--solid square.
    this._drawSquare(this._wallSprite, 0, 0, this._wallSprite.width, this._WALL_COLOR);
  },

  _drawFreeSprite() {
    // Pre-draws free tile sprite--solely game background.
    this._drawSpriteBackground(this._freeSprite);
  },

  _drawSnakeSprite() {
    // Pre-draws snake sprite--circle on game background.
    this._drawSpriteBackground(this._snakeSprite);
    const center = Math.round(this._snakeSprite.width / 2);
    const radius = Math.round(center - (center / 10));
    this._drawCircle(this._snakeSprite, center, center, radius, this._SNAKE_COLOR);
  },

  _drawFoodSprite() {
    // Pre-draws food sprite--small circle on game background.
    this._drawSpriteBackground(this._foodSprite);
    const center = Math.round(this._foodSprite.width / 2);
    const radius = Math.round(center - (center / 3));
    this._drawCircle(this._foodSprite, center, center, radius, this._FOOD_COLOR);
  },
};

function factoryCanvas(args) {
  const { id, size, tilePixelSize } = args;
  return Object.assign(Object.create(Canvas), {
    _id: id, // id for DOM game canvas
    _size: size, // game grid size
    _tilePixelSize: tilePixelSize, // pixel size of game tiles
  });
}

export default factoryCanvas;

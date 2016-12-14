/* eslint-env browser */

const Canvas = {
  _buffer: document.createElement('canvas'),
  _BACKGROUND_COLOR: '#464646',
  _SNAKE_COLOR: '#00ffe5',
  _FOOD_COLOR: '#acacac',
  _WALL_COLOR: '#606060',
  _snakeSprite: document.createElement('canvas'),
  _foodSprite: document.createElement('canvas'),
  _wallSprite: document.createElement('canvas'),
  _freeSprite: document.createElement('canvas'),
  firstRender(args) {
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
  _initializeSprites() {
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
    sprite.width = this._tilePixelSize;
    sprite.height = this._tilePixelSize;
  },
  _drawSpriteBackground(sprite) {
    this._drawSquare(sprite, 0, 0, sprite.width, this._BACKGROUND_COLOR);
  },
  _drawCircle(canvas, x, y, radius, color) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  },
  _drawSquare(canvas, x, y, size, color) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(x, y, x + size, y + size);
  },
  _drawWallSprite() {
    this._drawSpriteBackground(this._wallSprite);
    this._drawSquare(this._wallSprite, 0, 0, this._wallSprite.width, this._WALL_COLOR);
  },
  _drawFreeSprite() {
    this._drawSpriteBackground(this._freeSprite);
  },
  _drawSnakeSprite() {
    this._drawSpriteBackground(this._snakeSprite);
    const center = Math.round(this._snakeSprite.width / 2);
    const radius = Math.round(center - (center / 10));
    this._drawCircle(this._snakeSprite, center, center, radius, this._SNAKE_COLOR);
  },
  _drawFoodSprite() {
    this._drawSpriteBackground(this._foodSprite);
    const center = Math.round(this._foodSprite.width / 2);
    const radius = Math.round(center - (center / 3));
    this._drawCircle(this._foodSprite, center, center, radius, this._FOOD_COLOR);
  },
  _calcX(position) {
    return (position % this._size) * this._tilePixelSize;
  },
  _calcY(position) {
    return Math.floor(position / this._size) * this._tilePixelSize;
  },
};

function factoryCanvas(_id, _size, _tilePixelSize) {
  return Object.assign(Object.create(Canvas), {
    _size,
    _id,
    _tilePixelSize,
  });
}

export default factoryCanvas;

# snake

A simple in-browser implementation of the arcade game.

## [Live Demo](http://ss-snake.herokuapp.com)

## Architecture Overview

### Backend

A bare-bones Node.js server.

It doesn't do very much beyond basic URL routing and serving client-side files--but if you'd still like to take a look, it's in the `src/server` directory. 

### Frontend

A vanilla JS app split across several modules (you can find them in the `src/client/js/modules` directory), loosely adhering to a MVC pattern.

All JS is written in ES6 and then transpiled & bundled with Babel & Rollup.

The entry point to the app is `src/client/js/main.js`, which imports the first module:

#### game.js

The highest-level module. It acts as a controller and handles the basic flow of the game, including:
- Checking for keyboard input
- Running the main game loop (includes checking for pause, resetting the game, and the loss condition)
- Passing new game information, based on user input, to `state-controller.js` 
- Receving new state information from `state-controller.js` 
- Passing that state information to `canvas.js` to be rendered

#### state-controller.js

A controller that interacts primarily with `state.js`. It:
- Generates new immutable states from user input passed to it by `game.js` and previous state information from `state.js`
- Sends new states to `state.js`
- Exposes some functions that return state information necessary for `game.js`’s logic

#### canvas.js

The view module. It renders game states (passed to it by game.js) to an HTML5 canvas by:
1. Pre-rendering all game sprites to separate canvases when the game is initialized
2. Drawing those sprites to a buffer canvas when a new view is needed
3. Drawing the buffer canvas to the main canvas when the view update is complete

#### state.js

The state/model module. Internally, it stores a series of immutable game states, so that the entire history of a played game exists within an instance.

Additionally, it exposes functions that return information about the most recent game state.

## Environment Setup

(Assumes Linux/Unix and a Node.js installation)

1. In the root project directory, `npm install`

2. To create a new build of the project in the `lib` directory, `npm run build`

## Running Locally

- If you'd like to run a local instance of the app that continually updates on changes to the `src` directory: 
	1. `npm start`
	2. Navigate to `localhost:3000`

- If you'd like to test a slightly more production-ready (i.e. minified server) version of the app:
	1. Build the app as instructed in the “Environment Setup” section
	2. `npm run serve`
	3. Navigate to `localhost:3000`

## Next Steps

(In no particular order)

### State History 
Since `state.js` stores a history of a single game's state, it would be possible & interesting to extend the game to include rewind/replay/variable speeds/etc. by exposing more data in `state.js` and then modifying the game loop structure in `game.js` to let the player use these features.

Currently, the state history just resets when the user starts the game again after a loss—but a lot more could be done with this architecture.

### More Efficient View Updates
`canvas.js` currently redraws the entire game board (to a buffer) every time the state updates. Since this version of snake is visually simple, HTML5 canvases are well-optimized in most browsers, and the app already pre-draws most game elements, this redrawing doesn’t make a large performance hit.

However, `canvas.js` could be further optimized by only redrawing game sprites to the canvas when absolutely necessary—i.e. only drawing free game tiles when the snake moves off of them, for example. This could be implemented by building the necessary logic directly into `canvas.js` (less preferable, as it would confuse the purpose/function of `canvas.js`) or by creating a new controller module/adding the rendering logic to `game.js` (more preferable).

### View Animations
`game.js` has two primary loops--one for checking input & instantiating necessary game state changes, and another for sending render updates to `canvas.js`. Both loops also operate on different intervals, which are specified when the game is started in `main.js`.

Right now, this structure isn't being used as it could be—the view loop really only updates when the state changes. However, since the two loops run separately, and the game allows for variable framerates for the rendering loop, a next step could be to implement animations for the snake's movement, eating food, game end, etc. to make it more visually interesting.

### Persistent Score Counter
A simple step, but a counter somewhere in the view that tracks a user's best score (i.e. longest snake) across multiple games could improve the experience.

### Smarter Default Snake Direction
Currently, when the game starts, the snake starts moving to the right as an arbitrary default direction. However, because the snake starts each game in a random location on the board, things sometimes go poorly when, say, the snake starts one or two tiles from the right wall and the player can’t react in time.

So, adding logic to the initial state generation in `state-controller.js` that could intelligently calculate the default snake direction based on the snake’s starting location—making it move, say, toward the wall that it’s farthest from—could be a good next step.


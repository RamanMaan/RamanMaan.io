/**
 * Must be loaded after main.js
 */

function playSnake() {
	/* Global Constants */
	//board constants
	var _canvas = $('#snake-canvas')[0];
	var _context = _canvas.getContext('2d');
	var _scoreElement = $('#score');
	const _cellWidth = 20;
	const _spawnMargins = 5;
	const _defaultSnakeLength = 5;
	var _gameLoop;

	//colour constants
	const _foodColour = '#150076';
	const _snakeColour = '#171717';
	const _cellStrokeColour = '#909192';

	/* Runtime Variables */
	var food;
	var score;
	var _Snake;
	var paused;

	//directions manager
	const _dir = {
		LEFT: 'left',
		RIGHT: 'right',
		UP: 'up',
		DOWN: 'down',
		getRandom: function () {
			switch (Math.floor(Math.random() * 4)) {
				case 0:
					return _dir.LEFT;
				case 1:
					return _dir.UP;
				case 2:
					return _dir.DOWN;
				case 3:
					return _dir.RIGHT;
			}
		}
	};

	//initial housekeeping to allow canvas to resize in case window resized
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();

	init();

	/**
	 * Initializes the game
	 */
	function init() {
		score = 0;
		paused = true;
		createSnake();
		createFood();
		createLoop();
		updateScore();

		/**
		 * This function creates the loop that calls run
		 */
		function createLoop() {
			if (typeof _gameLoop != 'undefined') {
				clearInterval(_gameLoop);
			}
			_gameLoop = setInterval(run, 60);
		}

		/**
		 * This function creates the snake with a random direction at a random location
		 */
		function createSnake() {
			_Snake = [];

			//initial snake direction
			_Snake.direction = _dir.getRandom();

			//initial starting location within canvas dimensions and spawnMargins
			var startX = getRandomPoint((_canvas.width / _cellWidth) - 2 * _spawnMargins) + _spawnMargins;
			var startY = getRandomPoint((_canvas.height / _cellWidth) - 2 * _spawnMargins) + _spawnMargins;

			//build snake along current direction
			switch (_Snake.direction) {
				case _dir.RIGHT:
					createSnakeRight();
					break;
				case _dir.LEFT:
					createSnakeLeft();
					break;
				case _dir.UP:
					createSnakeUp();
					break;
				case _dir.DOWN:
					createSnakeDown();
					break;
			}

			function createSnakeRight() {
				for (var i = 0; i < _defaultSnakeLength; i++) {
					_Snake.push({x: startX - i, y: startY});
				}
			}

			function createSnakeDown() {
				for (var i = 0; i < _defaultSnakeLength; i++) {
					_Snake.push({x: startX, y: startY - i});
				}
			}

			function createSnakeLeft() {
				for (var i = 0; i < _defaultSnakeLength; i++) {
					_Snake.push({x: startX + i, y: startY});
				}
			}

			function createSnakeUp() {
				for (var i = 0; i < _defaultSnakeLength; i++) {
					_Snake.push({x: startX, y: startY + i});
				}
			}
		}
	}

	/**
	 * This function is called in a loop to control game execution
	 */
	function run() {
		paint();
		addKeyListener();

		if (!paused) {
			moveSnake();
		}

		/**
		 * This function changes the snake direction and checks for food
		 */
		function moveSnake() {
			//where snake will move to
			var newX = _Snake[0].x;
			var newY = _Snake[0].y;

			switch (_Snake.direction) {
				case _dir.RIGHT:
					newX++;
					break;
				case _dir.LEFT:
					newX--;
					break;
				case _dir.UP:
					newY--;
					break;
				case _dir.DOWN:
					newY++;
					break;
			}

			//check for game over condition
			if (outOfBounds(newX, newY) || bodyCollision(newX, newY)) {
				init();
				return;
			}

			checkForFoodAndMove(newX, newY);
		}

		/**
		 * This function determines whether the snake has a body collision
		 *
		 * @param x - The new location being moved to x value
		 * @param y - The new location being moved to y value
		 * @returns {boolean} - if there is a collision returns true
		 */
		function bodyCollision(x, y) {
			for (var i = 0; i < _Snake.length; i++) {
				if (_Snake[i].x === x && _Snake[i].y === y) {
					//if any snake piece intersects then there is a collision
					return true;
				}
			}
			//There was no collision
			return false;
		}

		/**
		 * This function checks to see if snake is out of bounds
		 *
		 * @param x - The new location being moved to x value
		 * @param y - The new location being moved to y value
		 * @returns {boolean} - if the snake is out of bounds
		 */
		function outOfBounds(x, y) {
			return x === -1 || x >= _canvas.width / _cellWidth || y === -1 || y >= _canvas.height / _cellWidth;
		}

		/**
		 * This function moves snake forward by moving last block to front
		 * If there is food present in the new location it adds it as a new block instead
		 *
		 * @param x - the x of the next point to move snake to
		 * @param y - the y of the next point to move snake to
		 */
		function checkForFoodAndMove(x, y) {
			//block to move
			var tail;

			//check to see if there's food
			if (x === food.x && y === food.y) {
				//found food
				score++;
				updateScore();

				//just add a new tail block
				tail = {x: x, y: y};

				createFood();
			} else {
				//no food found
				//shuffle tail block to front
				tail = _Snake.pop();
				tail.x = x;
				tail.y = y;
			}
			//add to snake
			_Snake.unshift(tail);
		}
	}

	/**
	 * This function controls painting the game
	 *
	 * Private functions:
	 *    paintCanvas, paintSnake, paintFood all paint their associated elements
	 *    paintCell is used by them to paint a specific cell
	 */
	function paint() {
		paintCanvas();
		paintSnake();
		paintFood();

		function paintCanvas() {
			//clear the canvas
			_context.clearRect(0, 0, _canvas.width, _canvas.height);

			//paint pause msg
			if (paused) {
				_context.font = '30px Raleway';
				_context.textAlign = 'center';
				_context.fillText('Controls: WASD or Arrow Keys', _canvas.width / 2, _canvas.height / 2);
			}
		}

		function paintSnake() {
			_context.fillStyle = _snakeColour;
			for (var i = 0; i < _Snake.length; i++) {
				var cell = _Snake[i];
				paintCell(cell.x, cell.y);
			}
		}

		function paintFood() {
			_context.fillStyle = _foodColour;
			paintCell(food.x, food.y);
		}

		function paintCell(x, y) {
			_context.fillRect(x * _cellWidth, y * _cellWidth, _cellWidth, _cellWidth);
			_context.strokeStyle = _cellStrokeColour;
			_context.strokeRect(x * _cellWidth, y * _cellWidth, _cellWidth, _cellWidth);
		}
	}

	/**
	 * This function creates a food item at a random x and y
	 */
	function createFood() {
		food = {
			x: getRandomPoint((_canvas.width) / _cellWidth),
			y: getRandomPoint(_canvas.height / _cellWidth)
		};
	}

	/**
	 * This function updates the Score element text
	 */
	function updateScore() {
		_scoreElement.text('Score: ' + score);
	}

	/**
	 * This function generates a random number between 0 and max
	 *
	 * @param max - The largest the random number can be
	 * @returns {number} - A rounded down random number between 0 and max
	 */
	function getRandomPoint(max) {
		return Math.floor(Math.random() * max);
	}

	/**
	 * This function resizes the canvas to fit the gameArea dimensions
	 * This function is called on resize
	 */
	function resizeCanvas() {
		var gameArea = $('#game-area');

		//resize canvas to as close to grid pattern as possible
		_canvas.width = gameArea.width() - (gameArea.width()) % _cellWidth;
		_canvas.height = gameArea.height() - (gameArea.height()) % _cellWidth;
	}

	/**
	 * This function adds a keydown function to be called on keydown events
	 * WASD and arrow keys are supported controls
	 */
	function addKeyListener() {
		$(document).keydown(function (e) {
			paused = false;

			var keyPressed = e.which;
			if ((keyPressed == '37' || keyPressed == '65') && _Snake.direction !== _dir.RIGHT) {
				_Snake.direction = _dir.LEFT;
			} else if ((keyPressed == '38' || keyPressed == '87') && _Snake.direction !== _dir.DOWN) {
				_Snake.direction = _dir.UP;
			} else if ((keyPressed == '39' || keyPressed == '68') && _Snake.direction !== _dir.LEFT) {
				_Snake.direction = _dir.RIGHT;
			} else if ((keyPressed == '40' || keyPressed == '83') && _Snake.direction !== _dir.UP) {
				_Snake.direction = _dir.DOWN;
			}
		});
	}
}
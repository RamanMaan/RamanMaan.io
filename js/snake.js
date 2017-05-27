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
	const _spawnMargins = 6;
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

	function init() {
		score = 0;
		createSnake();
		createFood();
		createLoop();
		paintScore();
	}

	function createLoop() {
		if (typeof _gameLoop != 'undefined') {
			clearInterval(_gameLoop);
		}
		_gameLoop = setInterval(run, 60);
	}

	function run() {
		paint();
		moveSnake();
	}

	function paint() {
		paintCanvas();
		paintSnake();
		paintFood();
	}

	function paintCanvas() {
		//clear the canvas
		_context.clearRect(0, 0, _canvas.width, _canvas.height);
	}

	function paintSnake() {
		_context.fillStyle = _snakeColour;
		for (var i = 0; i < _Snake.length; i++) {
			var cell = _Snake[i];
			paintCell(cell.x, cell.y);
		}
	}

	function paintScore() {
		_scoreElement.text('Score: ' + score);
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

	function moveSnake() {
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
		if (outOfBounds(newX, newY) || bodyCollision(newX, newY, _Snake)) {
			init();
			return;
		}

		eatFood(newX, newY);
		checkControls();
	}


	/* Helper functions */
	function createSnake() {
		_Snake = [];

		_Snake.direction = _dir.getRandom();

		var startX = getRandomPoint((_canvas.width) / _cellWidth - _spawnMargins);
		var startY = getRandomPoint(_canvas.height / _cellWidth - _spawnMargins);

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
			for (var i = _defaultSnakeLength - 1; i >= 0; i--) {
				_Snake.push({x: startX + i, y: startY});
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

		function createSnakeDown() {
			for (var i = _defaultSnakeLength - 1; i >= 0; i--) {
				_Snake.push({x: startX, y: startY + i});
			}
		}
	}

	function createFood() {
		food = {
			x: getRandomPoint((_canvas.width) / _cellWidth),
			y: getRandomPoint(_canvas.height / _cellWidth)
		};
	}

	function resizeCanvas() {
		var gameArea = $('#game-area');

		//resize canvas to as close to grid pattern as possible
		_canvas.width = gameArea.width() - (gameArea.width()) % _cellWidth;
		_canvas.height = gameArea.height() - (gameArea.height()) % _cellWidth;
	}

	function getRandomPoint(max) {
		return Math.floor(Math.random() * max);
	}

	function eatFood(x, y) {
		var tail;
		if (x == food.x && y == food.y) {
			//found food
			createFood();
			score++;
			paintScore();
			tail = {x: x, y: y};
		} else {
			tail = _Snake.pop();
			tail.x = x;
			tail.y = y;
		}
		//add to snake
		_Snake.unshift(tail);
	}

	function checkControls() {
		$(document).keydown(function (e) {
			var keyPressed = e.which;
			if ((keyPressed == '37' || keyPressed == '65') && _Snake.direction != _dir.RIGHT) {
				_Snake.direction = _dir.LEFT;
			} else if ((keyPressed == '38' || keyPressed == '87') && _Snake.direction != _dir.DOWN) {
				_Snake.direction = _dir.UP;
			} else if ((keyPressed == '39' || keyPressed == '68') && _Snake.direction != _dir.LEFT) {
				_Snake.direction = _dir.RIGHT;
			} else if ((keyPressed == '40' || keyPressed == '83') && _Snake.direction != _dir.UP) {
				_Snake.direction = _dir.DOWN;
			}
		});
	}

	function outOfBounds(x, y) {
		return x == -1 || x >= _canvas.width / _cellWidth || y == -1 || y >= _canvas.height / _cellWidth;
	}

	function bodyCollision(x, y, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].x == x && arr[i].y == y) {
				return true;
			}
		}
		//else return false
		return false;
	}
}
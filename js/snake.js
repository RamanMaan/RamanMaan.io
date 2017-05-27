/**
 * Must be loaded after main.js
 */

function playSnake() {
	/* Global Constants */
	//board constants
	var _canvas = $('#snake-canvas')[0];
	var _context = _canvas.getContext('2d');
	var _scoreElement = $('#score');
	var _cellWidth = 20;
	var _spawnMargins = 6;
	var _defaultSnakeLength = 5;
	var _gameLoop;

	//colour constants
	var _foodColour = '#150076';
	var _snakeColour = '#1d1d1d';
	var _cellStrokeColour = '#EDEEEF';
	var _borderStrokeColour = '#150076';

	/* Runtime Variables */
	var direction;
	var food;
	var score;
	var snake;

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

		//draw the border
		_context.strokeStyle = _borderStrokeColour;
		_context.strokeRect(0, 0, _canvas.width, _canvas.height);
	}

	function paintSnake() {
		_context.fillStyle = _snakeColour;
		for (var i = 0; i < snake.length; i++) {
			var cell = snake[i];
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

	function moveSnake() {
		var newX = snake[0].x;
		var newY = snake[0].y;

		switch (direction) {
			case 'right':
				newX++;
				break;
			case 'left':
				newX--;
				break;
			case 'up':
				newY--;
				break;
			case 'down':
				newY++;
				break;
		}

		//check for game over condition
		if (outOfBounds(newX, newY) || bodyCollision(newX, newY, snake)) {
			init();
			return;
		}

		eatFood(newX, newY);
		checkControls();
	}


	/* Helper functions */
	function createSnake() {
		snake = [];
		direction = getRandomDirection();

		var startX = getRandomPoint((_canvas.width) / _cellWidth - _spawnMargins);
		var startY = getRandomPoint(_canvas.height / _cellWidth - _spawnMargins);

		switch (direction) {
			case 'right':
				createSnakeRight();
				break;
			case 'left':
				createSnakeLeft();
				break;
			case 'up':
				createSnakeUp();
				break;
			case 'down':
				createSnakeDown();
				break;
		}

		function createSnakeRight() {
			for (var i = _defaultSnakeLength - 1; i >= 0; i--) {
				snake.push({x: startX + i, y: startY});
			}
		}

		function createSnakeLeft() {
			for (var i = 0; i < _defaultSnakeLength; i++) {
				snake.push({x: startX + i, y: startY});
			}
		}

		function createSnakeUp() {
			for (var i = 0; i < _defaultSnakeLength; i++) {
				snake.push({x: startX, y: startY + i});
			}
		}

		function createSnakeDown() {
			for (var i = _defaultSnakeLength - 1; i >= 0; i--) {
				snake.push({x: startX, y: startY + i});
			}
		}
	}

	function getRandomDirection() {
		switch (Math.floor(Math.random() * 4)) {
			case 0:
				return 'left';
			case 1:
				return 'up';
			case 2:
				return 'down';
			case 3:
				return 'right';
		}
	}

	function createFood() {
		food = {
			x: getRandomPoint((_canvas.width) / _cellWidth),
			y: getRandomPoint(_canvas.height / _cellWidth)
		};
	}

	function createLoop() {
		if (typeof _gameLoop != 'undefined') {
			clearInterval(_gameLoop);
		}
		_gameLoop = setInterval(run, 60);
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
			tail = snake.pop();
			tail.x = x;
			tail.y = y;
		}
		//add to snake
		snake.unshift(tail);

		function paintScore() {
			_scoreElement.text('Score: ' + score);
		}
	}

	function checkControls() {
		$(document).keydown(function (e) {
			var keyPressed = e.which;
			if ((keyPressed == '37' || keyPressed == '65') && direction != 'right') {
				direction = 'left';
			} else if ((keyPressed == '38' || keyPressed == '87') && direction != 'down') {
				direction = 'up';
			} else if ((keyPressed == '39' || keyPressed == '68') && direction != 'left') {
				direction = 'right';
			} else if ((keyPressed == '40' || keyPressed == '83') && direction != 'up') {
				direction = 'down';
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
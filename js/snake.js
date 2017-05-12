/**
 * Must be loaded after main.js
 */

 function playSnake() {
  //snake constants
  var canvas = $('#snake-canvas')[0];
  var context = canvas.getContext('2d');
  var cellWidth = 20;
  var sidebarWidth = 50;
  var foodColour = "blue";
  var snakeColour = "black";
  var cellStrokeColour = "white";
  var defaultSnakeLength = 5;
  var spawnMargins = 6;

  //running variables
  var direction;
  var food;
  var score;
  var snake;
  var game_loop;

  //initial housekeeping to allow canvas to resize in case window resized
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
  init();

  function init() {
    score = 0;
    createSnake();
    createFood();
    createLoop();
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
    context.clearRect(0,0,canvas.width,canvas.height);

    //draw the border
    context.strokeStyle="black";
    context.strokeRect(0,0,canvas.width,canvas.height);

    //draw the score
    var scoreText = "Score: " + score;
    context.font="bold 14px Raleway";
    context.fillText(scoreText, 20, 20);
  }

  function paintSnake() {
    context.fillStyle = snakeColour;
    for(var i = 0; i < snake.length; i++) {
      var cell = snake[i];
      paintCell(cell.x, cell.y);
    }
  }

  function paintFood() {
    context.fillStyle = foodColour;
    paintCell(food.x, food.y)
  }

  function paintCell(x, y) {
    context.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    context.strokeStyle = cellStrokeColour;
    context.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
  }

  function moveSnake() {
    var newX = snake[0].x;
    var newY = snake[0].y;

    switch(direction) {
      case "right": newX++;
        break;
      case "left": newX--;
        break;
      case "up": newY--;
        break;
      case "down": newY++;
        break;
    }

    //check for game over condition
    if( outOfBounds(newX, newY)|| bodyCollision(newX, newY, snake)) {
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

    var startX = getRandomPoint((canvas.width)/cellWidth - spawnMargins);
    var startY = getRandomPoint(canvas.height/cellWidth - spawnMargins);

    switch(direction) {
      case "right":
        createSnakeRight();
        break;
      case "left":
        createSnakeLeft();
        break;
      case "up":
        createSnakeUp();
        break;
      case "down":
        createSnakeDown();
        break;
    }

    function createSnakeRight() {
      for(var i = defaultSnakeLength - 1; i >= 0; i--) {
        snake.push({x : startX + i, y : startY})
      }
    }
    function createSnakeLeft() {
      for(var i = 0; i < defaultSnakeLength; i++) {
        snake.push({x : startX + i, y : startY})
      }
    }
    function createSnakeUp() {
      for(var i = 0; i < defaultSnakeLength; i++) {
        snake.push({x : startX, y : startY + i})
      }
    }
    function createSnakeDown() {
      for(var i = defaultSnakeLength - 1; i >= 0; i--) {
        snake.push({x : startX, y : startY + i})
      }
    }
  }

  function getRandomDirection() {
    switch(Math.floor(Math.random() * 4)) {
      case 0: return "left";
      case 1: return "up";
      case 2: return "down";
      case 3: return "right";
    }
  }

  function createFood() {
    food = {
      x: getRandomPoint((canvas.width)/cellWidth),
      y: getRandomPoint(canvas.height/cellWidth)
    };
  }

  function createLoop() {
    if(typeof game_loop != "undefined") {
      clearInterval(game_loop);
    }
    game_loop = setInterval(run, 60);
  }

  function resizeCanvas() {
    var w = $(window).width() - sidebarWidth;
    var h = $(window).height();

    canvas.width = w - w%cellWidth;
    canvas.height = h - h%cellWidth;
  }

  function getRandomPoint(max) {
    return Math.floor(Math.random() * max);
  }

  function eatFood(x, y) {
    var tail;
    if(x == food.x && y == food.y) {
      //found food
      createFood();
      score++;
      tail = {x : x, y : y};
    } else {
      tail = snake.pop();
      tail.x = x;
      tail.y = y;
    }
    //add to snake
    snake.unshift(tail);
  }

  function checkControls() {
    $(document).keydown(function(e){
      var keyPressed = e.which;
      if((keyPressed == "37" || keyPressed == "65") && direction != "right") {
        direction = "left";
      } else if((keyPressed == "38" || keyPressed == "87") && direction != "down") {
        direction = "up";
      } else if((keyPressed == "39" || keyPressed == "68") && direction != "left") {
        direction = "right";
      } else if((keyPressed == "40" || keyPressed == "83") && direction != "up") {
        direction = "down";
      }
    })
  }

  function outOfBounds(x, y) {
    return x == -1 || x >= canvas.width/cellWidth || y == -1 || y >= canvas.height/cellWidth
  }

  function bodyCollision(x, y, arr) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i].x == x && arr[i].y == y) {
        return true;
      }
    }
    //else return false
    return false;
  }
 }
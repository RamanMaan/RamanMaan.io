var paused = true;

$(document).ready(function(){
  $('.play').click(function() {
    //playSnake();
    paused = false;
    //$('.game-area').toggleClass('invisible');
  });

  //constants
  var canvas = $('#snake-canvas')[0];
  var context = canvas.getContext('2d');
  var cellWidth = 15;
  var sidebarWidth = 50;

  //running variables
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

    if(typeof game_loop != "undefined") {
      clearInterval(game_loop);
    }
    game_loop = setInterval(paint, 60);
  }

  function resizeCanvas() {
    var w = $(window).width() - sidebarWidth;
    var h = $(window).height();

    canvas.width = w - w%cellWidth;
    canvas.height = h - h%cellWidth;
  }

  function getRandomDirection() {
    var key = Math.floor(Math.random() * 4);
    switch(key) {
      case 0: return "left";
      case 1: return "up";
      case 2: return "down";
      case 3: return "right";
    }
  }

  function createSnake() {
    var length = 3;
    direction = getRandomDirection();

    var startX = getRandomPoint((canvas.width)/cellWidth -length);
    var startY = getRandomPoint(canvas.height/cellWidth);

    snake = [];
    for(var i = length - 1; i >= 0; i--) {
      snake.push({x : startX + i, y : startY})
    }
  }

  function paint() {
    paintCanvas();
    paintSnake();
    paintFood();

    moveSnake();
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

  function createFood() {
    food = {
      x: getRandomPoint((canvas.width)/cellWidth - length),
      y: getRandomPoint(canvas.height/cellWidth),
    };
  }

  function paintCell(x, y) {
    context.fillStyle="blue";
    context.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    context.strokeStyle = "white";
    context.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
  }

  function paintFood() {
    paintCell(food.x, food.y)
  }

  function paintSnake() {
    for(var i = 0; i < snake.length; i++) {
      var cell = snake[i];
      paintCell(cell.x, cell.y);
    }
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

    if(newX == -1 || newX >= canvas.width/cellWidth || newY == -1 || newY >= canvas.height/cellWidth || bodyCollision(newX, newY, snake)) {
      //gameover
      init();
      return;
    }

    eatFood();
    function eatFood() {
      if(newX == food.x && newY == food.y) {
        var tail = {x : newX, y : newY};
        createFood();
        score++;
      } else {
        var tail = snake.pop();
        tail.x = newX;
        tail.y = newY;
      }

      snake.unshift(tail);
    }

    function bodyCollision(x, y, arr) {
      for(var i = 0; i < arr.length; i++) {
        if(arr[i].x == x && arr[i].y == y) {
          return true;
        }
      }
      return false;
    }
  }

  function getRandomPoint(max) {
    return Math.floor(Math.random() * max);
  }
  checkControls();
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
});
$(document).ready(function(){
  $('.play').click(function() {
    if($('#snake-canvas').length) {
      //already exists, so we should end game
      $('#snake-canvas').remove();
    } else {
      //we should create the snake game canvas
      var canvas = document.createElement('canvas');
      $('#game-area').append("<canvas id=\"snake-canvas\"></canvas>");
      playSnake();
    }
  });
});
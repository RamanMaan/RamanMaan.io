$(document).ready(function(){
  $('.play').click(function() {
    //swap play button and header text depending on game state
    flipPlayElements();
    $('#score').toggleClass('hidden')

    //handle the snake canvas
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

function flipPlayElements() {
  $('#play').text(function(i, oldText) {
    return oldText === 'Play' ? 'End' : 'Play'
  });
  var src = $('#side-play').attr('src') === 'images/play.png' ? 'images/cancel.png' : 'images/play.png';
  $('#side-play').attr('src', src);
}

function comingSoon() {
  alert("Coming soon!");
}
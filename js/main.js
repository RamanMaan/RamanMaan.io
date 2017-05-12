var paused = true;

$(document).ready(function(){
  $('.play').click(function() {
    playSnake();
    paused = !paused;
    $('.game-area').toggleClass('invisible');
  });
});
var paused = true;
var alreadyCreated = false;//band-aid solution, will implement a better one

$(document).ready(function(){
  $('.play').click(function() {
    if(!alreadyCreated) {
      alreadyCreated = true;
      playSnake();
    }
    paused = !paused;
    $('.game-area').toggleClass('invisible');
  });
});
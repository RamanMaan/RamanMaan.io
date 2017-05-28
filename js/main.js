$(document).ready(function () {
	$('.play').click(function () {
		//swap play button and header text depending on game state
		flipPlayElements();
		setPlayArea();
		//handle the snake canvas
		if ($('#snake-canvas').length) {
			//already exists, so we should end game
			$('#snake-canvas').fadeRemove(200);
		} else {
			//we should create the snake game canvas
			$('<canvas id="snake-canvas"></canvas>').hide().appendTo('#game-area').fadeIn(300);
			playSnake();
		}
	});
});

function flipPlayElements() {
	$('#play').text(function (i, oldText) {
		return oldText === 'Play' ? 'End' : 'Play';
	});
	var src = $('#side-play').attr('src') === 'images/play.png' ? 'images/cancel.png' : 'images/play.png';
	$('#side-play').attr('src', src);
}

function setPlayArea() {
	//let score appear
	$('#score').toggleClass('hidden');

	//blur background
	$('#container').toggleClass('blur');
}

function comingSoon() {
	alert('Coming soon!');
}

jQuery.fn.fadeRemove = function(speed) {
	$(this).fadeOut(speed, function() {
		$(this).remove();
	})
}
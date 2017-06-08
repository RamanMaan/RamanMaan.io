$(document).ready(function () {
	// begin the typing animation
	$(function () {
		$('#typed-header').typed({
			strings: ['<small>Programmer.^1000 Nerd.^1000 Kind of cool guy.^1000</small>', 'Raman <strong>Maan</strong>'],
			typeSpeed: 3,
			startDelay: 800,
			backSpeed: 0.5,
			backDelay: 650,
			showCursor: false
		});
	});
});
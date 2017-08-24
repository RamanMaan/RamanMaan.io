/**
 * Adds a class to navbar if it's scrolled at all
 */
$(window).scroll(function() {
	if ($(".navbar").offset().top > 50) {
		$('.navbar-transparent').addClass('affix');
	} else {
		$('.navbar-transparent').removeClass('affix');
	}
});
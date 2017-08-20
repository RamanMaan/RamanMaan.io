$(window).scroll(function() {
	if ($(".navbar").offset().top > 50) {
		$('.navbar-transparent').addClass('affix');
		$(".navbar-fixed-top").addClass("top-nav-collapse");
	} else {
		$('.navbar-transparent').removeClass('affix');
		$(".navbar-fixed-top").removeClass("top-nav-collapse");
	}
});
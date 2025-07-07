
$(function(){
	if (window.matchMedia('(max-width: 1649px)').matches) {
		$(function() {
			$('.headbtn a').on('click',function(){
				$('.headnavlayer').slideToggle('fast');
				$('.headbtn a').toggleClass('open');
				return false;
			});
			$('.headnav a').on('click',function(){
				var href = $(this).attr('href');
				if (href && (href.indexOf('#') === 0 || href === '' || href === '#')) {
					// for anchor links
					$('.headnavlayer').slideToggle('fast');
					$('.headbtn a').toggleClass('open');
					return false;
				} else {
					// for external links
					$('.headnavlayer').slideToggle('fast');
					$('.headbtn a').toggleClass('open');
				}
			});
		});
	}

	if (window.matchMedia('(max-width: 1409px)').matches) {
		$(function() {
			$('#lineup .morebtn').on('click',function(){
				$('#lineup .lineupmore').slideDown();
				$('#lineup .morebtn').hide();
				$('#lineup .morebtn.close').show();
				return false;
			});
			$('#lineup .morebtn.close').on('click',function(){
				$('#lineup .lineupmore').slideUp();
				$('#lineup .morebtn').show();
				$('#lineup .morebtn.close').hide();
				return false;
			});
		});
	}
})
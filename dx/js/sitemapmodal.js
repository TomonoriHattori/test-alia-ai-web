$(function(){
	var open = $('#sitemapopen'),
		close = $('.modalclose'),
		container = $('#sitemap'),
	otherwin2 = $('#download');

	open.on('click',function(){	
		container.addClass('active');
		container.fadeIn('fast');
		otherwin2.removeClass('active');
		return false;
	});

	close.on('click',function(){	
		container.fadeOut('fast');
		container.removeClass('active');
	});

});
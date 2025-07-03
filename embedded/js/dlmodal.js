$(function(){
	var open = $('.dllink'),
		close = $('.modalclose2'),
		container = $('#download'),
	otherwin1 = $('#sitemap');

	open.on('click',function(){	
		container.addClass('active');
		container.fadeIn('fast');
		otherwin1.removeClass('active');
		return false;
	});

	close.on('click',function(){	
		container.fadeOut('fast');
		container.removeClass('active');
	});

});
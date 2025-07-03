$(function() {
	$('.lang_en').on('click',function(){	
		$(this).addClass('active');
		$('.lang_jp').removeClass('active');
		return false;
	});
	$('.lang_jp').on('click',function(){	
		$(this).addClass('active');
		$('.lang_en').removeClass('active');
		return false;
	});
});

$(function() {
	
	$('#hint .morebtn').on('click',function(){	
		$('#hint .wpmore').slideDown();
		$('#hint .morebtn').hide();
		$('#hint .morebtn.close').show();
		return false;
	});

		$('#hint .morebtn.close').on('click',function(){	
		$('#hint .wpmore').slideUp();
		$('#hint .morebtn').show();
		$('#hint .morebtn.close').hide();
		return false;
	});
	
});
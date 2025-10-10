$(function(){
	$('.btnprof').on('click',function(){	
		$('#profmodal').show();
		return false;
	});
	
	$('.profclose').on('click',function(){	
		$('#profmodal').hide();
		return false;
	});

});
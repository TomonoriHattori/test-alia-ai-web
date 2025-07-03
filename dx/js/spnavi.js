
$(function(){
	if (window.matchMedia('(max-width: 767px)').matches) {
		
		$(function() {
	$('.head01btn a').on('click',function(){	
		$('.head01nav').slideToggle('fast');
		$('.head01btn a').toggleClass('open');
		return false;
	});

});

}})
$(function(){
	var openbtn = $('.chatopen'),
		winclose = $('.winclose'),
		chatclose = $('.chatclose'),
		chatbtnwindow = $('.chatbtnwindow'),
		container = $('#chatwindow'),
		icon = $('#chatbtn');
		chara = $('.chara');

	openbtn.on('click',function(){	
		container.fadeIn('fast');
		chatbtnwindow.fadeOut("fast");
		chatclose.fadeOut("fast");
		chara.addClass("open");
		return false;
	});

	winclose.on('click',function(){	
		container.fadeOut('fast');
		chatbtnwindow.fadeIn("fast");
		chatclose.fadeIn("fast");
		chara.removeClass("open");
	});

	chatclose.on('click',function(){	
		icon.fadeOut('fast');
	});

	init_mp_avatar();
	function init_mp_avatar() {
		var options = {
			elm: $('#avatar').get(0),
			width: 512,
			height: 512,
			lookat: true,
			showfps: false
		}
		mpwebgl.init(options);
		$(window).on(LOAD_COMPLETED_EVENT, function () {
			mpwebgl.loadnextface("/items/ainyan.bin");
		});
	}
});
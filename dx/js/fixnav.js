$(function() {
    var $fixElement = $('#head02'); // 追従する要素
    var baseFixPoint = $fixElement.offset().top; // 追従する要素の初期位置
    var fixClass = 'is-fixed'; // 追従時に付与するclass
 
    // 要素が追従する処理
    function fixFunction() {
        var windowScrolltop = $(window).scrollTop();
        // スクロールが初期位置を通過しているとき
        if(windowScrolltop >= baseFixPoint) {
            $fixElement.addClass(fixClass);
        } else {
            $fixElement.removeClass(fixClass);
        }
    }
 
    $(window).on('load scroll', function() {
        fixFunction();
    });
});
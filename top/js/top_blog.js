var blogItemList = [];

$(function () {
  "use strict";

  //タグリスト取得
  var URL = '';
  if ($('body').hasClass('en')) {
    URL = "https://blog-headline.an.r.appspot.com/api/v1/tag_page_list_ax_en.json";
  } else {
    URL = "https://blog-headline.an.r.appspot.com/api/v1/tag_page_list_ax.json";
  }
  $.getJSON(URL, function (data) {
    blogItemList = data;

    //日付でソート
    blogItemList.sort(function (a, b) {
      if (a.date > b.date) {
        return -1;
      } else {
        return 1;
      }
    });

    /* ==========================================================================
    Top> blog list 
    ========================================================================== */
    if ($('#blog').length > 0) {

      var append_list = '';
      var topInfo_blog_list = '';

      var max = 5;
      if (max > blogItemList.length) {
        max = blogItemList.length;
      }

      for (let i = 0; i < max; i++) {

        //thumbnail
        var thumbnail = '<img class="objectFit" src="/img/dummy.jpg" alt="">';
        if (blogItemList[i].thumbnail.length > 0) {
          thumbnail = '<img class="objectFit" src="' + blogItemList[i].thumbnail + '" alt="">';
        }

        append_list += '<li class="post"><a href="' + blogItemList[i].url + '"target="_blank">' + 
          '<div class="postinner">' + 
          '<div class="pic">' + thumbnail + '</div>' + 
          '<div class="textarea">' + 
          '<div class="date">' + blogItemList[i].date.split('-').join('.') + '</div>' + 
          '<div class="title"><span maxchar="40" >' + blogItemList[i].title + '</span></div>' + 
          '<div class="text"><span maxchar="100">' + blogItemList[i].txt + '</div>' + 
          '</div>' + 
          '</div>' + 
          '</a></li>'
      }

      $('#blog .postlist').append(append_list);

      //文字詰め
      txtLengthCut($('#blog .postlist').find('li .title span'));
      txtLengthCut($('#blog .postlist').find('li .text span'));

    }

  });

});

//テキスト文字詰め
function txtLengthCut(elm , max) {

    var afterTxt = '…';
    elm.each(function () {

        var cutFigure;
        if( max != undefined ){
           cutFigure = max; 
        } else{
           cutFigure =  $(this).attr('maxchar');
        }

        // console.log( 'cutFigure: ' + cutFigure );

        var html = $(this).html();
        var tagPattern = /(<\/?[^>]+>)|([^<]+)/g;
        var isReplaced = false;
        var replaced = html.replace(tagPattern, function () {
            var result = "";
            if (arguments[1]) {
                // タグはそのまま返す
                result = arguments[1];
            } else if (arguments[2]) {
                var text = arguments[2];
                // 指定文字数以上なら省略する
                if (text.length > cutFigure) {
                    result = text.substr(0, cutFigure) + afterTxt;
                    isReplaced = true;
                } else {
                    result = text;
                }
            }

            return result;
        });

        if (isReplaced === true) {
            $(this).html(replaced);
        }

        $(this).css({
            visibility: 'visible'
        });
    });

}
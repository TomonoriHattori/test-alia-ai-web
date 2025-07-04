var ua = navigator.userAgent.toLowerCase();
var isMobile = (ua.indexOf("iphone") > -1) || (ua.indexOf("ipod") > -1) || (ua.indexOf("ipad") > -1) || (ua.indexOf("Android") > -1 || (ua.indexOf("android") > -1) );

function updateMetaViewport(){

	var viewportContent;
	if(isMobile){
        var ww = window.screen.width;
        if( ww <= 600){
            viewportContent = "width=375, initial-scale=1";
        }else if( ww <= 768 ){
            viewportContent = "width=device-width, initial-scale=1";
        }else{
            viewportContent = "width=1440, initial-scale=1";
        }
	}
	// else{
    //     var ww = document.documentElement.clientWidth;
    //     if( ww < 768){
    //         viewportContent = "width=375";
    //     }else if( ww < 1280){
    //         viewportContent = "width=1280";
    //     }else{
    //         viewportContent = "width=device-width, initial-scale=1";
    //     }
    // }
	document.querySelector("meta[name='viewport']").setAttribute("content", viewportContent);
}
window.addEventListener("resize", updateMetaViewport, false);
window.addEventListener("orientationchange", updateMetaViewport, false);
var ev = document.createEvent("UIEvent");
ev.initEvent("resize", true, true)
window.dispatchEvent(ev);

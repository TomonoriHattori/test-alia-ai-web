"use strict"
var mpFace_, mpRender_, mpCtlAnim_;
var mpFaceId_;
var options = {
    elm: null,
    width: 400,
    height: 400,
    lookat: false,
    showfps: false,
    isTriggerByJquery: true
}

var lastTime_ = 0,
    startTime_ = 0;
var dw_ = 400,
    dh_ = 400;
var mpcorePath = "./js/mpcore.min.js";
var LOAD_COMPLETED_EVENT = "mpLoadComplete",
    AVATAR_LOADING_EVENT = "mpAvatarLoading",
    LOAD_YOURAVATAR_EVENT = "mpLoadYourAvatarComplete",
    LOAD_AVATARAGING_EVENT = "mpLoadAvatarAgingComplete",
    LOAD_VIDEO_EVENT = "mpLoadVideoComplete",
    GET_FEATURE_POINT_OK_EVENT = "mpGetFeaturePointComplete",
    GET_FEATURE_POINT_ERROR = "mpGetFeaturePointError",
    TIMEOUT_REQUET_ERROR = "mpTimeoutRequestError",
    GLOBAL_ERROR = "mpGlobalError",
    DISCONNECTION = "disconnection",
    REQUEST_NIGAOE_ANALYZER_COMPLETE = "mpRequestNigaoeAnalyzerComplete",
    REQUEST_NIGAOE_GENERATE_COMPLETE = "mpRequestNigaoeGenerateComplete",
    CAPTURE_CANVAS_FRAME = "mpCaptureCanvasFrame",
    PLAYTTS = "mpPlayTTS";;
var Module = {
    preRun: (function () {
        MpFS.prepareResource();
    }),
    postRun: (function () {
        mpwebgl.init_mp_param();
    }),
    print: (function () { }),
    printErr: function (text) {
        if (debug_mode)
            console.error(text);
    },
    canvas: null,
    setStatus: function (text) { },
    totalDependencies: 0,
    monitorRunDependencies: function (left) { },
};
var mpPriFn = {
    _TriggerJquery: function (e, data) {
        var event = new CustomEvent(e, {
            "detail": data
        });
        window.dispatchEvent(event);
    },
    _base64DecToArr: function (sBase64, nBlocksSize) {
        var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""),
            nInLen = sB64Enc.length,
            nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2,
            taBytes = new Uint8Array(nOutLen);

        for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
            nMod4 = nInIdx & 3;
            nUint24 |= this._b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 1) {
                for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                    taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                }
                nUint24 = 0;
            }
        }
        return taBytes;
    },
    _b64ToUint6: function (nChr) {
        return nChr > 64 && nChr < 91 ? nChr - 65 :
            nChr > 96 && nChr < 123 ? nChr - 71 :
                nChr > 47 && nChr < 58 ? nChr + 4 :
                    nChr === 43 ? 62 :
                        nChr === 47 ? 63 :
                            0;
    },
    _validateMpFace: function () {
        if (mpFaceId_ == undefined || mpFaceId_ < 0)
            return false;
        return true;
    },
    _initLookAt_pc: function () {
        var c = Module["canvas"];
        $(c).on('mousemove', function (e) {
            if (!mpwebgl)
                return;
            var userAgent = window.navigator.userAgent.toLowerCase();
            var x = 0.5;
            var y = 0.5;
            var size = $(c).width();
            if (userAgent.indexOf('chrome') != -1) {
                x = e.offsetX / size;
                y = 1.0 - e.offsetY / size;
            } else if (userAgent.indexOf('safari') != -1) {
                x = e.offsetX / size;
                y = 1.0 - e.offsetY / size;
            } else if (userAgent.indexOf('gecko') != -1) {
                var bounds = c.getBoundingClientRect();
                x = (e.clientX - bounds.left) / size;
                y = 1.0 - (e.clientY - bounds.top) / size;
            } else if (userAgent.indexOf('ipad') != -1 || userAgent.indexOf('iphone') != -1) {
                var bounds = c.getBoundingClientRect();
                x = (e.clientX - bounds.left) / size;
                y = 1.0 - (e.clientY - bounds.top) / size;
            }
            mpwebgl.lookat(x, y);
        });
        $(c).on('mouseout', function (e) {
            if (!mpwebgl)
                return;
            mpwebgl.resetlookat();
        });
    },
    _initLookAt_sm: function () {
        var c = Module["canvas"];
        $(c).bind('touchmove', function (e) {
            var cliX = e.originalEvent.touches[0].clientX - (e.target?.getBoundingClientRect()?.x ?? 0);
            var cliY = e.originalEvent.touches[0].clientY - (e.target?.getBoundingClientRect()?.y ?? 0);
            var x = cliX / $(c).width();
            var y = 1 - cliY / $(c).height();
            mpwebgl.lookat(x, y);
            e.preventDefault();
        });
        $(c).bind('touchend', function (e) {
            mpwebgl.resetlookat();
            e.preventDefault();
        });
        $(c).bind('touchcancel', function (e) {
            e.preventDefault();
        });
    },
    _isMobileDevice: function () {
        if ('ontouchstart' in window)
            return true;
        return false;
    }

}
var mpwebgl = {
    init: function (_options) {
        var url = mpcorePath;
        $.getScript(url, function () {
            options = _options;
            Module['canvas'] = options.elm;
            if (!Module['canvas'])
                Module['canvas'] = mpcanvas;
            if (options.width > 0 && options.height > 0) {
                dw_ = options.width;
                dh_ = options.height;
                Browser.setCanvasSize(dw_, dh_);
            } else {
                Browser.setCanvasSize(Module['canvas'].width, Module['canvas'].height);
            }
            var att = {
                antialias: 0,
                depth: 0,
                stencil: 0,
                alpha: 1,
                premultipliedAlpha: 0
            };
            Module.ctx = Browser.createContext(Module['canvas'], true, true, att);
            if (options.lookat) {
                if (mpPriFn._isMobileDevice())
                    mpPriFn._initLookAt_sm();
                else
                    mpPriFn._initLookAt_pc();
            } else {
                document.body.addEventListener('touchmove', disabledPinchzZoom, { passive: false });
            }
            GLctx.enable(GLctx.SCISSOR_TEST);
            Module['canvas'].style.backgroundColor = "transparent";
        });
    },
    init_mp_param: function () {
        mpFace_ = new Module.MpFace();
        mpRender_ = new Module.MpRender();
        mpRender_.Init();
        mpRender_.SetFace(mpFace_);
        mpCtlAnim_ = mpFace_.GetCtlAnimation();
        setInterval(this.animate, 20);
        mpPriFn._TriggerJquery(LOAD_COMPLETED_EVENT);
    },
    preparereslater: function () {
        MpFS.prepareResourceLater();
    },
    lookat: function (x, y) {
        if (options.lookat != undefined && options.lookat == true && mpCtlAnim_) {
            mpCtlAnim_.LookAt(0, [x, y], 1.0);
        }
    },
    resetlookat: function () {
        if (options.lookat != undefined && options.lookat == true && mpCtlAnim_) {
            mpCtlAnim_.LookAt(500, [0.5, 0.5], 1.0);
        }
    },
    loadnextface: function (name) {
        return this.loadavatar(name);
    },
    loadavatar: function (name) {
        if (name == undefined || name == "") {
            mess_ = "face not found";
            return mpFaceId_ = -1;
        }
        Module['canvas'].style.backgroundColor = "transparent";
        try {
            mpFaceId_ = mpFace_.Load(name);
        } catch (e) {
            mess_ = e;
            mpFaceId_ = -1;
        }
        mpRender_.EnableDrawBackground(false);
        mpCtlAnim_.SetParamf(Module.MpCtlAnimationParam.NECK_X_MAX_ROT, 2.0);
        mpCtlAnim_.SetParamf(Module.MpCtlAnimationParam.NECK_Y_MAX_ROT, 2.0);
        mpCtlAnim_.SetParamf(Module.MpCtlAnimationParam.NECK_Z_MAX_ROT, 0.2);
        mpCtlAnim_.JSSetParamiv = function (arr) {
            var data = new Int32Array([arr[0], arr[1], arr[2]]);
            var nDataBytes = data.length * data.BYTES_PER_ELEMENT;
            var dataPtr = Module._malloc(nDataBytes);
            Module.HEAP32.set(data, dataPtr / data.BYTES_PER_ELEMENT);
            mpCtlAnim_.SetParamiv(Module.MpCtlAnimationParam.BLINK_FREQS, dataPtr);
        }
        mpCtlAnim_.JSSetParamiv([5, 0, 1]);
        mpCtlAnim_.SetUnconsciousGain(1.0);

        return mpFaceId_;
    },
    setUnconsciousGain(value) {
        if (mpCtlAnim_)
            mpCtlAnim_.SetUnconsciousGain(value);
    },
    animate: function (name) {
        if (true) {
            if (!mpPriFn._validateMpFace())
                return;
            var timeNow = new Date().getTime();
            if (startTime_ == 0) {
                startTime_ = timeNow;
            }
            if (lastTime_ != 0) {
                var elapsed = timeNow - lastTime_;
            }
            lastTime_ = timeNow;
            mpCtlAnim_.Update(timeNow - startTime_);
            mpRender_.SetViewport([0, 0, Module['canvas'].width, Module['canvas'].height]);
            GLctx.clearColor(0.0, 0.0, 0.0, 0.0);
            GLctx.clear(Module.ctx.COLOR_BUFFER_BIT);
            mpRender_.Draw();
        }
    },
}

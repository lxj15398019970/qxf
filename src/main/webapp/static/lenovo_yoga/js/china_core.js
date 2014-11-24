//Download by http://down.liehuo.net
(function () {
    var cn = cn || {};
    cn.g = function (id) {
        if (typeof id == "string" || id instanceof String) {
            return document.getElementById(id);
        } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
            return id;
        }
        return null;
    };
    cn.$ = {};
    try {
        cn.$ = Sizzle;
    } catch (err) {
        cn.$ = cn.g;
    }
    ;
    cn.toRgb = function (str) {
        if (str == "transparent") {
            return[255, 255, 255];
        }
        ;
        if (str.indexOf("#") != -1) {
            var ma = /(\w{1,2})(\w{1,2})(\w{1,2})/i.exec(str);
            if (str.length < 5) {
                ma[1] += ma[1];
                ma[2] += ma[2];
                ma[3] += ma[3];
            }
            ;
            return[parseInt(ma[1], 16), parseInt(ma[2], 16), parseInt(ma[3], 16)];
        } else {
            var re = str.replace(/rgb\(|\)|\ /g, '').split(',');
            return[Number(re[0]), Number(re[1]), Number(re[2])];
        }
    };
    cn.hex = function (v) {
        var v = Math.round(v).toString(16);
        return(v.length == 1) ? ("0" + v) : v;
    };
    if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
        cn.ie = document.documentMode || +RegExp['\x241'];
    }
    if (/firefox\/(\d+\.\d)/i.test(navigator.userAgent)) {
        cn.firefox = +RegExp['\x241'];
    }
    if (/chrome\/(\d+\.\d)/i.test(navigator.userAgent)) {
        cn.chrome = +RegExp['\x241'];
    }
    if (/opera\/(\d+\.\d)/i.test(navigator.userAgent)) {
        cn.opera = +RegExp['\x241'];
    }
    (function () {
        var ua = navigator.userAgent;
        if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua)) {
            cn.safari = +(RegExp['\x241'] || RegExp['\x242']);
        }
    })();
    cn.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);
    cn.isStrict = document.compatMode == "CSS1Compat";
    cn.isWebkit = /webkit/i.test(navigator.userAgent);
    cn.trim = function (source) {
        var re = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
        return String(source).replace(re, "");
    };
    cn.each = function (object, callback) {
        var i = 0;
        for (var value = object[0]; i < object.length && callback.call(value, i, value) !== false; value = object[++i]) {
        }
        return object;
    };
    cn.setStyle = function (elem, prop) {
        for (var k in prop) {
            elem.style[k] = prop[k];
        };
        return elem;
    };
    cn.getStyle = function (elem, key) {
        var value = elem.style[key];
        if (!value) {
            var style = elem.currentStyle || (cn.ie ? elem.style : getComputedStyle(elem, null));
            value = style[key];
        }
        return value;
    };
    cn.show = function (elem, fn) {
        cn.setStyle(elem, {display: "block"});
        return elem;
    };
    cn.hide = function (elem, fn) {
        cn.setStyle(elem, {display: "none"});
        return elem;
    };
    cn.addClass = function (elem, className) {
        var classArray = className.split(/\s+/);
        var result = elem.className;
        var classMatch = " " + result + " ";
        var i = 0, l = classArray.length;
        for (; i < l; i++) {
            if (classMatch.indexOf(" " + classArray[i] + " ") < 0) {
                result += ' ' + classArray[i];
            }
        }
        elem.className = result;
        return elem;
    };
    cn.removeClass = function (elem, className) {
        var classArray = className.split(/\s+/);
        var result = elem.className;
        var classMatch = " " + result + " ";
        var i = 0, l = classArray.length;
        for (; i < l; i++) {
            var re = new RegExp(classArray[i], "g");
            if (classMatch.indexOf(" " + classArray[i] + " ") >= 0) {
                result = cn.trim(result.replace(re, ""));
            }
        }
        elem.className = result;
        return elem;
    };
    cn.createScript = function (url, param) {
        var s = document.createElement("script");
        param ? url += "?" + encodeURI(param) : url;
        s.src = url;
        document.getElementsByTagName("head")[0].appendChild(s);
    };
    cn.getEvent = function (event) {
        var ev = event || window.event;
        if (!ev) {
            var c = this.getEvent.caller;
            while (c) {
                ev = c.arguments[0];
                if (ev && (Event == ev.constructor || MouseEvent == ev.constructor)) {
                    break;
                }
                c = c.caller;
            }
        }
        return ev;
    };
    cn.getTarget = function (event) {
        var e = cn.getEvent();
        return e.target || e.srcElement;
    };
    cn.getX = function () {
        var e = cn.getEvent();
        var _left = document.documentElement.scrollLeft || document.body.scrollLeft;
        return e.pageX || e.clientX + _left;
    };
    cn.getY = function () {
        var e = cn.getEvent();
        var _top = document.documentElement.scrollTop || document.body.scrollTop;
        return e.pageY || e.clientY + _top;
    };
    cn.pageX = function (elem) {
        return elem.offsetParent ? (elem.offsetLeft + cn.pageX(elem.offsetParent)) : elem.offsetLeft;
    };
    cn.pageY = function (elem) {
        return elem.offsetParent ? (elem.offsetTop + cn.pageY(elem.offsetParent)) : elem.offsetTop;
    };
    cn.on = function (elem, type, listener) {
        type = type.replace(/^on/i, '').toLowerCase();
        var realListener = listener;
        if (elem.addEventListener) {
            elem.addEventListener(type, realListener, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, realListener);
        }
        return elem;
    };
    cn.addEvent = cn.on;
    cn.preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };
    cn.un = function (elem, type, listener) {
        type = type.replace(/^on/i, '').toLowerCase();
        var realListener = listener;
        if (elem.removeEventListener) {
            elem.removeEventListener(type, realListener, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, realListener);
        }
        return elem;
    };
    cn.removeEvent = cn.un;
    cn.setCookie = function (name, value, expires, path, domain) {
        if (expires && isNaN(expires) === false) {
            expires = new Date(new Date().getTime() + expires);
        }
        ;
        document.cookie = name + "=" + escape(value) + ((expires) ? "; expires=" + expires.toGMTString() : "") + ((path) ? "; path=" + path : "; path=/") + ((domain) ? ";domain=" + domain : "");
    };
    cn.getCookie = function (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        }
        return null;
    };
    cn.clearCookie = function (name, path, domain) {
        if (cn.getCookie(name)) {
            document.cookie = name + "=" + ((path) ? "; path=" + path : "; path=/") + ((domain) ? "; domain=" + domain : "") + ";expires=Fri, 02-Jan-1970 00:00:00 GMT";
        }
    };
    cn.Easing = {None: function (t) {
        return t;
    }, In: function (t) {
        return t * t;
    }, InCirc: function (t) {
        return-(Math.sqrt(1 - t * t) - 1);
    }, InBack: function (t) {
        return t * t * (2.70158 * t - 1.70158);
    }, InExpo: function (t) {
        return(t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
    }, Out: function (t) {
        return(2 - t) * t;
    }, OutCirc: function (t) {
        return Math.sqrt(1 - (--t) * t);
    }, OutBack: function (t) {
        return(t -= 1) * t * (2.70158 * t + 1.70158) + 1;
    }, OutExpo: function (t) {
        return(t == 1) ? 1 : -Math.pow(2, -10 * t) + 1;
    }, Both: function (t) {
        return(t *= 2) < 1 ? .5 * t * t : .5 * (1 - (--t) * (t - 2));
    }, BothStrong: function (t) {
        return(t *= 2) < 1 ? .5 * t * t * t * t : .5 * (2 - (t -= 2) * t * t * t);
    }, BothCirc: function (t) {
        return(t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }, ElasticIn: function (t) {
        return(t === 0 || t === 1) ? t : -Math.pow(2, 10 * (t -= 1)) * Math.sin((t - .075) * (2 * Math.PI) / .3);
    }, ElasticOut: function (t) {
        return(t === 0 || t === 1) ? t : Math.pow(2, -10 * t) * Math.sin((t - .075) * (2 * Math.PI) / .3) + 1;
    }, BounceIn: function (t) {
        return 1 - cn.Easing.BounceOut(1 - t);
    }, BounceOut: function (t) {
        if (t < .363636) {
            return 7.5625 * t * t;
        } else if (t < .727272) {
            return 7.5625 * (t -= .5454) * t + .75;
        } else if (t < .90909) {
            return 7.5625 * (t -= .8181) * t + .9375;
        }
        ;
        return 7.5625 * (t -= .9545) * t + .984375;
    }};
    cn.shift = function (elem, prop, ea, speed, callback) {
        var myTime, i = 0, t, styleValue = {}, initValue, thisValue;
        ea ? ea : ea = "None";
        speed ? speed : speed = 80;
        myTime = setInterval(move, 15);
        function move() {
            t = cn.Easing[ea](i / speed);
            for (n in prop) {
                initValue = cn.getStyle(elem, n);
                if (n == "opacity") {
                    var v = initValue * 100 + (prop[n] - initValue) * 100 * t;
                    if (cn.ie) {
                        thisValue = "alpha(opacity=" + v + ")";
                        styleValue["filter"] = thisValue;
                    } else {
                        thisValue = v / 100;
                        styleValue[n] = thisValue;
                    }
                } else if (n == "color" || n == "backgroundColor") {
                    var va = cn.toRgb(initValue), vb = cn.toRgb(prop[n]), arr = [];
                    cn.each(va, function (i) {
                        arr.push(cn.hex(va[i] + (vb[i] - va[i]) * t));
                    });
                    thisValue = "#" + arr.join("");
                    styleValue[n] = thisValue;
                } else if (n.indexOf("scroll") != -1) {
                    initValue = elem[n];
                    thisValue = parseInt(initValue) + (parseInt(prop[n]) - parseInt(initValue)) * t;
                    elem[n] = thisValue;
                } else {
                    thisValue = parseInt(initValue) + (parseInt(prop[n]) - parseInt(initValue)) * t + "px";
                    styleValue[n] = thisValue;
                }
                cn.setStyle(elem, styleValue);
            }
            if (i == speed) {
                clearInterval(myTime);
                if (callback)callback();
            } else {
                i++;
            }
        }
    };
    cn.drag = function (elem, callback, moveFn) {
        var D = {}, x = 0, y = 0, pageX = 0, pageY = 0;
        cn.on(elem, "mousedown", function () {
            D.start()
        });
        D.start = function () {
            x = cn.getX();
            y = cn.getY();
            pageX = cn.pageX(elem);
            pageY = cn.pageY(elem);
            if (cn.getStyle(elem, "position") != "absolute")cn.setStyle(elem, {position: "absolute"});
            cn.on(document, "mousemove", D.move);
            cn.on(document, "mouseup", D.stop);
            if (cn.ie) {
                elem.setCapture();
            } else {
                cn.on(window, "blur", D.stop);
                cn.getEvent().preventDefault();
            }
            ;
        };
        D.move = function () {
            if (!moveFn) {
                var newX = cn.getX(), newY = cn.getY();
                cn.setStyle(elem, {left: (newX - x + pageX) + "px", top: (newY - y + pageY) + "px"});
            } else {
                moveFn(elem, x, y, pageX, pageY);
            }
        };
        D.stop = function () {
            cn.un(document, "mousemove", D.move);
            cn.un(document, "mouseup", D.stop);
            if (cn.ie) {
                elem.releaseCapture();
            } else {
                cn.un(window, "blur", D.stop);
            }
            ;
            if (callback)callback(elem);
        };
    };
    window.cn = cn;
})();
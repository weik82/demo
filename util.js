(function (doc, win) {
    let docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        docWidth = docEl.clientWidth,
        recalc = function () {
            let clientWidth = docWidth > 750 ? 360 : docWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = clientWidth / 750 * 100 + 'px';
        };
    if (!doc.addEventListener) return;
    doc.addEventListener('DOMContentLoaded', recalc, false);
    if (docWidth > 750) return;
    win.addEventListener(resizeEvt, recalc, false);
})(document, window);

//requestAnimationFrame
(function () {
    let lastTime = 0;
    let vendors = ['webkit', 'moz'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            let id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());
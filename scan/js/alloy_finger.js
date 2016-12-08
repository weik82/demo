/* AlloyFinger v0.1.2
 * By dntzhang
 * Github: https://github.com/AlloyTeam/AlloyFinger
 */
;(function() {
    function getLen(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    function dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    function getAngle(v1, v2) {
        var mr = getLen(v1) * getLen(v2);
        if (mr === 0) return 0;
        var r = dot(v1, v2) / mr;
        if (r > 1) r = 1;
        return Math.acos(r);
    }

    function cross(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    }

    function getRotateAngle(v1, v2) {
        var angle = getAngle(v1, v2);
        if (cross(v1, v2) > 0) {
            angle *= -1;
        }

        return angle * 180 / Math.PI;
    }
    var AlloyFinger = function (el, option) {

        el.addEventListener("touchstart", this.start.bind(this), false);
        el.addEventListener("touchmove", this.move.bind(this), false);
        el.addEventListener("touchend", this.end.bind(this), false);
        el.addEventListener("touchcancel",this.cancel.bind(this),false);

        this.preV = { x: null, y: null };
        this.pinchStartLen = null;
        this.scale = 1;
        this.isDoubleTap = false;
        this.rotate = option.rotate || function () { };
        this.touchStart = option.touchStart || function () { };
        this.multipointStart = option.multipointStart || function () { };
        this.multipointEnd=option.multipointEnd||function(){};
        this.pinch = option.pinch || function () { };
        this.swipe = option.swipe || function () { };
        this.tap = option.tap || function () { };
        this.doubleTap = option.doubleTap || function () { };
        this.longTap = option.longTap || function () { };
        this.singleTap = option.singleTap || function () { };
        this.pressMove = option.pressMove || function () { };
        this.touchMove = option.touchMove || function () { };
        this.touchEnd = option.touchEnd || function () { };
        this.touchCancel = option.touchCancel || function () { };

        this.delta = null;
        this.last = null;
        this.now = null;
        this.tapTimeout = null;
        this.touchTimeout = null;
        this.longTapTimeout = null;
        this.swipeTimeout=null;
        this.x1 = this.x2 = this.y1 = this.y2 = null;
        this.preTapPosition={x:null,y:null};
    };

    AlloyFinger.prototype = {
        start: function (evt) {
            if(!evt.touches)return;
            this.now = Date.now();
            this.x1 = evt.touches[0].pageX;
            this.y1 = evt.touches[0].pageY;
            this.delta = this.now - (this.last || this.now);
            this.touchStart(evt);
            if(this.preTapPosition.x!==null){
                this.isDoubleTap = (this.delta > 0 && this.delta <= 250&&Math.abs(this.preTapPosition.x-this.x1)<30&&Math.abs(this.preTapPosition.y-this.y1)<30);
            }
            this.preTapPosition.x=this.x1;
            this.preTapPosition.y=this.y1;
            this.last = this.now;
            var preV = this.preV,
                len = evt.touches.length;
            if (len > 1) {
                this._cancelLongTap();
                var v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
                preV.x = v.x;
                preV.y = v.y;
                this.pinchStartLen = getLen(preV);
                this.multipointStart(evt);
            }
            this.longTapTimeout = setTimeout(function(){
                this.longTap(evt);
            }.bind(this), 750);
        },
        move: function (evt) {
            if(!evt.touches)return;
            var preV = this.preV,
                len = evt.touches.length,
                currentX = evt.touches[0].pageX,
                currentY = evt.touches[0].pageY;
            this.isDoubleTap=false;
            if (len > 1) {
                var v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY };

                if (preV.x !== null) {
                    if (this.pinchStartLen > 0) {
                        evt.scale = getLen(v) / this.pinchStartLen;
                        this.pinch(evt);
                    }

                    evt.angle = getRotateAngle(v, preV);
                    this.rotate(evt);
                }
                preV.x = v.x;
                preV.y = v.y;
            } else {
                if (this.x2 !== null) {
                    evt.deltaX = currentX - this.x2;
                    evt.deltaY = currentY - this.y2;

                }else{
                    evt.deltaX = 0;
                    evt.deltaY = 0;
                }
                this.pressMove(evt);
            }

            this.touchMove(evt);

            this._cancelLongTap();
            this.x2 = currentX;
            this.y2 = currentY;
            if (evt.touches.length > 1) {
                this._cancelLongTap();
                evt.preventDefault();
            }
        },
        end: function (evt) {
            if(!evt.changedTouches)return;
            this._cancelLongTap();
            var self = this;
            if( evt.touches.length<2){
                this.multipointEnd(evt);
            }
            this.touchEnd(evt);
            //swipe
            if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
                (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
                evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
                this.swipeTimeout = setTimeout(function () {
                    self.swipe(evt);

                }, 0)
            } else {
                this.tapTimeout = setTimeout(function () {
                    self.tap(evt);
                    // trigger double tap immediately
                    if (self.isDoubleTap) {
                        self.doubleTap(evt);
                        clearTimeout(self.touchTimeout);
                        self.isDoubleTap = false;
                    }else{
                        self.touchTimeout=setTimeout(function(){
                            self.singleTap(evt);
                        },250);
                    }
                }, 0)
            }

            this.preV.x = 0;
            this.preV.y = 0;
            this.scale = 1;
            this.pinchStartLen = null;
            this.x1 = this.x2 = this.y1 = this.y2 = null;
        },
        cancel:function(evt){
            clearTimeout(this.touchTimeout);
            clearTimeout(this.tapTimeout);
            clearTimeout(this.longTapTimeout);
            clearTimeout(this.swipeTimeout);
            this.touchCancel(evt);
        },
        _cancelLongTap: function () {
            clearTimeout(this.longTapTimeout);
        },
        _swipeDirection: function (x1, x2, y1, y2) {
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
        }


    };

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = AlloyFinger;
    }else {
        window.AlloyFinger = AlloyFinger;
    }
})();

(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

var To = function (el, property, value, time, ease, onEnd, onChange) {
    var current = el[property];
    var dv = value - current;
    var beginTime = new Date();
    var self = this;
    var currentEase = ease || function (a) {
            return a
        };
    this.tickID = null;
    var toTick = function () {
        var dt = new Date() - beginTime;
        if (dt >= time) {
            el[property] = value;
            onChange && onChange(value);
            onEnd && onEnd(value);
            cancelAnimationFrame(self.tickID);
            self.toTick = null;
            return;
        }
        el[property] = dv * currentEase(dt / time) + current;
        self.tickID = requestAnimationFrame(toTick);
        //self.tickID = requestAnimationFrame(toTick);
        //cancelAnimationFrame������ tickID = requestAnimationFrame(toTick);�ĺ���
        onChange && onChange(el[property]);
    };
    toTick();
    To.List.push(this);
};

To.List = [];

To.stopAll = function () {
    for (var i = 0, len = To.List.length; i < len; i++) {
        cancelAnimationFrame(To.List[i].tickID);
    }
    To.List.length = 0;
};

To.stop = function (to) {
    cancelAnimationFrame(to.tickID);
};

/* transformjs
 * By dntzhang
 */
;(function () {

    var Matrix3D = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        this.elements =window.Float32Array ? new Float32Array(16) : [];
        var te = this.elements;
        te[0] = (n11 !== undefined) ? n11 : 1; te[4] = n12 || 0; te[8] = n13 || 0; te[12] = n14 || 0;
        te[1] = n21 || 0; te[5] = (n22 !== undefined) ? n22 : 1; te[9] = n23 || 0; te[13] = n24 || 0;
        te[2] = n31 || 0; te[6] = n32 || 0; te[10] = (n33 !== undefined) ? n33 : 1; te[14] = n34 || 0;
        te[3] = n41 || 0; te[7] = n42 || 0; te[11] = n43 || 0; te[15] = (n44 !== undefined) ? n44 : 1;
    };

    Matrix3D.DEG_TO_RAD = Math.PI / 180;

    Matrix3D.prototype = {
        set: function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
            var te = this.elements;
            te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
            te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
            te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
            te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;
            return this;
        },
        identity: function () {
            this.set(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
            return this;
        },
        multiplyMatrices: function (a, be) {

            var ae = a.elements;
            var te = this.elements;
            var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
            var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
            var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
            var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

            var b11 = be[0], b12 = be[1], b13 = be[2], b14 = be[3];
            var b21 = be[4], b22 = be[5], b23 = be[6], b24 = be[7];
            var b31 = be[8], b32 = be[9], b33 = be[10], b34 = be[11];
            var b41 = be[12], b42 = be[13], b43 = be[14], b44 = be[15];

            te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

            te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

            te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

            te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

            return this;

        },
        // 解决角度为90的整数倍导致Math.cos得到极小的数，其实是0。导致不渲染
        _rounded: function(value,i){
            i= Math.pow(10, i || 15);
            // default
            return Math.round(value*i)/i;
        },
        appendTransform: function (x, y, z, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ,skewX,skewY, originX, originY, originZ) {

            var rx = rotateX * Matrix3D.DEG_TO_RAD;
            var cosx =this._rounded( Math.cos(rx));
            var sinx = this._rounded(Math.sin(rx));
            var ry = rotateY * Matrix3D.DEG_TO_RAD;
            var cosy =this._rounded( Math.cos(ry));
            var siny = this._rounded(Math.sin(ry));
            var rz = rotateZ * Matrix3D.DEG_TO_RAD;
            var cosz =this._rounded( Math.cos(rz * -1));
            var sinz =this._rounded( Math.sin(rz * -1));

            this.multiplyMatrices(this, [
                1, 0, 0, x,
                0, cosx, sinx, y,
                0, -sinx, cosx, z,
                0, 0, 0, 1
            ]);

            this.multiplyMatrices(this, [
                cosy, 0, siny, 0,
                0, 1, 0, 0,
                -siny, 0, cosy, 0,
                0, 0, 0, 1
            ]);

            this.multiplyMatrices(this,[
                cosz * scaleX, sinz * scaleY, 0, 0,
                -sinz * scaleX, cosz * scaleY, 0, 0,
                0, 0, 1 * scaleZ, 0,
                0, 0, 0, 1
            ]);

            if(skewX||skewY){
                this.multiplyMatrices(this,[
                    this._rounded(Math.cos(skewX* Matrix3D.DEG_TO_RAD)), this._rounded( Math.sin(skewX* Matrix3D.DEG_TO_RAD)), 0, 0,
                    -1*this._rounded(Math.sin(skewY* Matrix3D.DEG_TO_RAD)), this._rounded( Math.cos(skewY* Matrix3D.DEG_TO_RAD)), 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ]);
            }

            if (originX || originY || originZ) {
                this.elements[12] -= originX * this.elements[0] + originY * this.elements[4] + originZ * this.elements[8];
                this.elements[13] -= originX * this.elements[1] + originY * this.elements[5] + originZ * this.elements[9];
                this.elements[14] -= originX * this.elements[2] + originY * this.elements[6] + originZ * this.elements[10];
            }
            return this;
        }
    };

    function observe(target, props, callback) {
        for (var i = 0, len = props.length; i < len; i++) {
            var prop = props[i];
            watch(target, prop, callback);
        }
    }

    function watch(target, prop, callback) {
        Object.defineProperty(target, prop, {
            get: function () {
                return this["__" + prop];
            },
            set: function (value) {
                if (value !== this["__" + prop]) {
                    this["__" + prop] = value;
                    callback();
                }

            }
        });
    }

    window.Transform = function (element) {

        observe(
            element,
            ["translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ" , "rotateX", "rotateY", "rotateZ","skewX","skewY", "originX", "originY", "originZ"],
            function () {
                var mtx = element.matrix3D.identity().appendTransform( element.translateX, element.translateY, element.translateZ, element.scaleX, element.scaleY, element.scaleZ, element.rotateX, element.rotateY, element.rotateZ,element.skewX,element.skewY, element.originX, element.originY, element.originZ);
                element.style.transform = element.style.msTransform = element.style.OTransform = element.style.MozTransform = element.style.webkitTransform = "perspective("+element.perspective+"px) matrix3d(" + Array.prototype.slice.call(mtx.elements).join(",") + ")";
            });

        observe(
            element,
            [ "perspective"],
            function () {
                element.style.transform = element.style.msTransform = element.style.OTransform = element.style.MozTransform = element.style.webkitTransform = "perspective("+element.perspective+"px) matrix3d(" + Array.prototype.slice.call(element.matrix3D.elements).join(",") + ")";
            });

        element.matrix3D = new Matrix3D();
        element.perspective = 500;
        element.scaleX = element.scaleY = element.scaleZ = 1;
        //由于image自带了x\y\z，所有加上translate前缀
        element.translateX = element.translateY = element.translateZ = element.rotateX = element.rotateY = element.rotateZ =element.skewX=element.skewY= element.originX = element.originY = element.originZ = 0;
    }
})();
;(function (window, Finger, to, undefined) {
    function Preview(el, option) {
        this.element = typeof el === 'string' ? document.querySelector(el) : el;
        this.imageElement = typeof option.imageEl === 'string' ? document.querySelectorAll(option.imageEl) : option.imageEl
        this.index = option.index || 0;
        this.width = option.width;
        this.size = option.size;
        this.wrapInit();
        this.imagesInit();
    }

    Preview.prototype = {
        wrapInit: function () {
            var self = this, _delta = 0;
            new Finger(this.element, {
                touchMove: function (evt, el) {
                    if (Math.abs(evt.deltaX) > Math.abs(evt.deltaY)) {
                        To.stopAll();
                        _delta = evt.deltaX;
                        evt.preventDefault();
                        var _translateX = el.translateX + evt.deltaX;
                        if (_translateX <= 0 && _translateX >= -self.width * (self.size - 1)) {
                            el.translateX = _translateX;
                        }
                    }
                },
                swipe: function (evt, el) {
                    var _translateX = el.translateX;
                    var _deltaX = Math.abs(_translateX + self.width * self.index);
                    if (_deltaX > 50) {
                        if (evt.direction === "Left") {
                            if (self.index < self.size - 1) {
                                self.index++;
                                new To(el, "translateX", -self.width * self.index, 500, '', function () {
                                });
                            }
                        } else if (evt.direction === "Right") {
                            if (self.index > 0) {
                                self.index--;
                                new To(el, "translateX", -self.width * self.index, 500, '', function () {
                                });
                            }
                        }
                    } else {
                        new To(el, "translateX", -self.width * self.index, 200, '', function () {
                        });
                    }
                },
                touchEnd: function (evt, el) {
                    var _translateX = el.translateX;
                    var _deltaX = Math.abs(_translateX + self.width * self.index);
                    if (_deltaX <= 30 || (_delta < 30)) {
                        new To(el, "translateX", -self.width * self.index, 200, '', function () {
                        });
                    }
                }
            }, true);
        },
        imagesInit: function () {
            [].forEach.call(this.imageElement, function (element) {
                var initScale = 1;
                new AlloyFinger(element, {
                    multipointStart: function (evt, el) {
                        evt.stopPropagation();
                        initScale = el.scaleX;
                    },
                    pinch: function (evt, el) {
                        evt.stopPropagation();
                        evt.preventDefault();
                        if (evt.originCenter) {
                            el.style.transformOrigin = evt.originCenter;
                        }
                        el.scaleX = el.scaleY = initScale * evt.zoom;
                    },
                    multipointEnd: function (evt, el) {
                        evt.stopPropagation();
                        /*To.stopAll();*/
                        el.translateX = el.translateY = 0;
                        if (el.scaleX < 1) {
                            new To(el, "scaleX", 1, 200);
                            new To(el, "scaleY", 1, 200);
                        }
                        if (el.scaleX > 2) {
                            new To(el, "scaleX", 2, 200);
                            new To(el, "scaleY", 2, 200);
                        }
                    },
                    pressMove: function (evt, el) {
                        var _scale = el.scaleX;
                        if (_scale > 1) {
                            var _width = document.documentElement.clientWidth,
                                _height = document.documentElement.clientHeight,
                                _rect = el.getBoundingClientRect();
                            var _dx = el.translateX + evt.deltaX,
                                _dy = el.translateY + evt.deltaY;
                            if (_rect.left + evt.deltaX <= 0 && (_width - _rect.right - evt.deltaX <= 0)) {
                                evt.stopPropagation();
                                evt.preventDefault();
                                el.translateX = _dx;
                                if (_rect.top + evt.deltaY <= 0 && (_height - _rect.bottom - evt.deltaY <= 0)) {
                                    el.translateY = _dy;
                                }
                            }
                        } else if (_scale < 1) {
                            evt.stopPropagation();
                            evt.preventDefault();
                        }
                    }/*,
                     touchEnd: function (evt, el) {
                     var _scale = el.scaleX;
                     if (_scale > 1) {
                     var _width = document.documentElement.clientWidth,
                     _rect = el.getBoundingClientRect(),
                     _translateX = el.translateX;
                     if (_rect.right <= _width) {
                     new To(el, "translateX", _translateX + _width - _rect.right, 200, '', function () {
                     });
                     }
                     if (_rect.left >= 0) {
                     new To(el, "translateX", _translateX - _rect.left, 200, '', function () {
                     });
                     }
                     }
                     }*/
                }, true)
            })
        }
    };
    window.Preview = Preview;
})(window, AlloyFinger, To);
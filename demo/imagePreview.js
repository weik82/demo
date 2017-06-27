;(function (window, Finger, To, undefined) {
    function Preview(el, option) {
        this.element = typeof el === 'string' ? document.querySelector(el) : el;
        this.imageElement = typeof option.imageEl === 'string' ? document.querySelectorAll(option.imageEl) : option.imageEl;
        this.index = option.index || 0;
        this.width = option.width || this.element.querySelector(option.itemEl).getBoundingClientRect().width;
        this.size = option.size || this.imageElement.length;
        this._banner = screen.height - document.documentElement.clientHeight;
        this.init();
        if (this.index > 0 && this.index < this.size - 1) {
            new To(this.element, "translateX", -this.width * this.index, 0);
        }
    }

    Preview.prototype = {
        constructor: Preview,
        init: function () {
            this.wrapInit();
            this.imagesInit();
        },
        wrapInit: function () {
            var self = this;
            new Finger(this.element, {
                touchMove: function (evt, el) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    if (Math.abs(evt.deltaX) > Math.abs(evt.deltaY)) {
                        To.stopAll();
                        var _translateX = el.translateX + evt.deltaX;
                        if (_translateX <= 0 && _translateX >= -self.width * (self.size - 1)) {
                            el.translateX = _translateX;
                        }
                    }
                },
                swipe: function (evt, el) {
                    evt.preventDefault();
                    evt.stopPropagation();
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
                },
                touchEnd: function (evt, el) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    var _translateX = el.translateX;
                    var _deltaX = Math.abs(_translateX + self.width * self.index);
                    if (_deltaX <= 30) {
                        new To(el, "translateX", -self.width * self.index, 200, '', function () {
                        });
                    }
                }
            }, true);
        },
        imagesInit: function () {
            var self = this;
            [].forEach.call(this.imageElement, function (element) {
                var initScale = 1, preZoom = 1,
                    _bd = element.getBoundingClientRect(),
                    _width = _bd.width,
                    _height = _bd.height;
                new AlloyFinger(element, {
                    multipointStart: function (evt, el) {
                        evt.stopPropagation();
                        initScale = el.scaleX;
                    },
                    pinch: function (evt, el) {
                        evt.stopPropagation();
                        evt.preventDefault();
                        var _zoom = initScale * evt.zoom,
                            _translateX = el.translateX,
                            _translateY = el.translateY;
                        if (_zoom > 1 && _translateX) {
                            if (_translateX > 0) {
                                _translateX = _translateX + (_width * (_zoom - preZoom) / 2);
                            } else if (_translateX < 0) {
                                _translateX = _translateX - (_width * (_zoom - preZoom) / 2);
                            }
                            el.translateX = _translateX;
                        }
                        if (_zoom > 1 && _translateY) {
                            if (_translateY > 0) {
                                _translateY = _translateY + (_height * (_zoom - preZoom) / 2);
                            } else if (_translateY < 0) {
                                _translateY = _translateY - (_height * (_zoom - preZoom) / 2);
                            }
                            el.translateY = _translateY;
                        }
                        if (_zoom <= 1) {
                            el.translateX = 0;
                            el.translateY = 0;
                        }
                        preZoom = _zoom;
                        el.scaleX = el.scaleY = _zoom;

                    },
                    multipointEnd: function (evt, el) {
                        evt.stopPropagation();
                        /*To.stopAll();*/
                        // el.translateX = el.translateY = 0;
                        var _translateX = el.translateX;
                        // _translateX = _translateX + (_width * (el.scaleX - 2) / 2);
                        if (el.scaleX < 1) {
                            new To(el, "scaleX", 1, 200);
                            new To(el, "scaleY", 1, 200);
                            preZoom = 1;
                        }
                        if (el.scaleX > 2) {
                            if (_translateX) {
                                _translateX = _translateX + (_width * (2 - el.scaleX) / 2);
                            }
                            new To(el, "translateX", _translateX, 200);
                            new To(el, "scaleX", 2, 200);
                            new To(el, "scaleY", 2, 200);
                            preZoom = 2;
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
                            if (_rect.left === 0) {
                                el.translateX -= 0.01;
                            }
                            if (_width - _rect.right === 0) {
                                el.translateX += 0.01;
                            }
                            if (_rect.left < 0 && _width - _rect.right < 0) {
                                evt.stopPropagation();
                                evt.preventDefault();
                                if (_rect.left + evt.deltaX <= 0 && _width - _rect.right - evt.deltaX <= 0) {
                                    el.translateX = _dx;
                                }
                                if (_rect.left + evt.deltaX > 0) {
                                    el.translateX = _width * (_scale - 1) / 2;
                                }
                                if (_width - _rect.right - evt.deltaX > 0) {
                                    el.translateX = -_width * (_scale - 1) / 2;
                                }
                            }
                            if (_rect.top < 0 || _height - _rect.bottom < 0) {
                                if (_rect.top + evt.deltaY <= 0 && _height - _rect.bottom - evt.deltaY <= 0) {
                                    el.translateY = _dy;
                                    console.log(el.translateY, evt.deltaY, _rect.top);
                                }
                                if (_rect.top + evt.deltaY > 0) {
                                    el.translateY = _height * (_scale - 1) / 2;
                                }
                                if (_height - _rect.bottom - evt.deltaY > 0) {
                                    el.translateY = -_height * (_scale - 1) / 2;
                                }
                            }
                        } else if (_scale < 1) {
                            evt.stopPropagation();
                            evt.preventDefault();
                        }
                    }
                }, true)
            })
        }
    };
    window.Preview = Preview;
})(window, AlloyFinger, To);
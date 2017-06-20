var opt = {
    flows: [
        {
            work: function (t) {
                console.log(t)
            },
            start: [0, 2000, 4000, 6000]
        }, {
            work: function (t) {
                console.log(t)
            },
            start: 8000
        }, {
            work: function (t) {
                console.log(t)
            },
            start: [1, 10000]
        }
    ],
    onStart: function () {
        console.log('onStart');
    },
    onProgress: function () {
        console.log('onProgress');
    },
    onEnd: function () {
        console.log('onEnd');
    }
};
var opt1 = {

    flows: [
        function (t) {
            for (var i = 0; i < 1000000; i++) {
                document.querySelectorAll('body')
            }
            console.log(t + '---1')
            setTimeout(function () {
                this._nextTask()
            }.bind(this), 0)

        },
        function (t) {
            for (var i = 0; i < 1000000; i++) {
                document.querySelectorAll('body')
            }
            console.log(t + '---2')
            setTimeout(function () {
                this._nextTask()
            }.bind(this), 0)
        },
        function (t) {
            for (var i = 0; i < 1000000; i++) {
                document.querySelectorAll('body')
            }
            console.log(t + '---3');
        }
    ],
    onStart: function () {
        console.log('onStart');
    },
    onProgress: function () {
        console.log('onProgress');
    },
    onEnd: function () {
        console.log('onEnd');
    }
};
var opt2 = {
    auto: true,
    flows: [
        function (t) {
            for (var i = 0; i < 100000; i++) {
                document.querySelectorAll('body')
            }
            console.log(t + '---1')

        },
        function (t) {
            for (var i = 0; i < 100000; i++) {
                document.querySelectorAll('body')
            }
            console.log(t + '---2')
        },
        function (t) {
            for (var i = 0; i < 100000; i++) {
                document.querySelectorAll('body')
            }
            console.log(t + '---3');
        }
    ],
    onStart: function () {
        console.log('onStart');
    },
    onProgress: function () {
        console.log('onProgress');
    },
    onEnd: function () {
        console.log('onEnd');
    }
};
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

var WorkFlow = function (option) {
    this.startTime = null;
    this.workflow = [];
    this.workByTime = true;
    if (!Array.isArray(this.workflow)) {
        throw 'error info:flows must be an array';
    }
    this.maxWorkTime = null;
    this.timer = null;
    this.onStart = option.onStart || null;
    this.onProgress = option.onProgress || null;
    this.onEnd = option.onEnd || null;
    if (typeof option.flows[0] === 'function') {
        this.workByTime = false;
        this.workIndex = 0;
        this.auto = option.auto;
        this.workflow = option.flows;
    } else {
        this.initWorkflow(option.flows);
    }
};
WorkFlow.prototype = {
    constructor: WorkFlow,
    initWorkflow: function (flows) {
        var _length = flows.length, _workflow = this.workflow;
        for (var i = 0; i < _length; i++) {
            var _start = flows[i].start;
            if (typeof _start !== "number") {
                for (var j = 0, len = _start.length; j < len; j++) {
                    _workflow.push({
                        work: flows[i].work,
                        start: _start[j],
                        done: false,
                    });
                }
            } else {
                _workflow.push({
                    work: flows[i].work,
                    start: flows[i].start,
                    done: false,
                });
            }
        }
        _workflow.sort(function (a, b) {
            return a.start - b.start;
        });
        this.maxWorkTime = _workflow[_workflow.length - 1].start;
    },
    start: function () {
        this.onStart && this.onStart();
        if (this.workByTime) {
            this.startTime = new Date();
            this.loop();
        } else {
            this._startTask();
        }
    },
    _startTask: function () {
        this.workflow[this.workIndex].call(this, new Date().getSeconds());
        this.onProgress && this.onProgress();
        if (this.auto) {
            this._nextTask()
        }
    },
    _nextTask: function () {
        if (this.stop)return;
        this.workIndex++;
        this.workflow[this.workIndex].call(this, new Date().getSeconds());
        this.onProgress && this.onProgress();
        if (this.workIndex === this.workflow.length - 1) {
            this.stop = true;
            this.onEnd && this.onEnd();
        } else {
            if (this.auto) {
                this._nextTask();
            }
        }
    },
    loop: function () {
        var currentTime = new Date() - this.startTime;
        this.timer = setTimeout(function () {
            this.loop()
        }.bind(this), 0);
        this.workflow.forEach(function (flow) {
            if (currentTime >= flow.start) {
                if (!flow.done) {
                    flow.done = true;
                    flow.work.call(this, currentTime);
                    this.onProgress && this.onProgress();
                } else {
                    if (currentTime > this.maxWorkTime) {
                        clearInterval(this.timer);
                        this.finished = true;
                    }
                }
            }
        }.bind(this));
        if (this.finished) {
            this.onEnd && this.onEnd();
        }
    }
};
var wf = new WorkFlow(opt);
wf.start();

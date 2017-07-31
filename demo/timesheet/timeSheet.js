(function () {
    'use strict';
    let TimeSheet = function (container, min, max, data) {
        this.data = [];
        this.year = {
            min: min,
            max: max
        };
        this.parse(data || []);
        if (typeof document !== 'undefined') {
            this.container = (typeof container === 'string') ? document.querySelector('#' + container) : container;
            this.drawSections();
            this.insertData();
        }
    };
    TimeSheet.prototype.insertData = function () {
        let html = [];
        let widthMonth = this.container.querySelector('.scale section').offsetWidth;
        for (let n = 0, m = this.data.length; n < m; n++) {
            let cur = this.data[n];
            let bubble = this.createBubble(widthMonth, this.year.min, cur.start, cur.end);
            let line = [
                '<span style="margin-left: ' + bubble.getStartOffset() + 'px; width: ' + bubble.getWidth() + 'px;" class="bubble bubble-' + (cur.type || 'default') + '" data-duration="' + (cur.end ? Math.round((cur.end - cur.start) / 1000 / 60 / 60 / 24 / 39) : '') + '"></span>',
                '<span class="date">' + bubble.getDateLabel() + '</span> ',
                '<span class="label">' + cur.label + '</span>'
            ].join('');
            html.push('<li>' + line + '</li>');
        }
        this.container.innerHTML += '<ul class="data">' + html.join('') + '</ul>';
    };
    TimeSheet.prototype.drawSections = function () {
        let html = [];
        for (let c = this.year.min; c <= this.year.max; c++) {
            html.push('<section>' + c + '</section>');
        }
        this.container.className = 'timesheet color-scheme-default';
        this.container.innerHTML = '<div class="scale">' + html.join('') + '</div>';
    };
    TimeSheet.prototype.parseDate = function (date) {
        if (date.indexOf('/') === -1) {
            date = new Date(parseInt(date, 10), 0, 1);
            date.hasMonth = false;
        } else {
            date = date.split('/');
            date = new Date(parseInt(date[1], 10), parseInt(date[0], 10) - 1, 1);
            date.hasMonth = true;
        }
        return date;
    };
    TimeSheet.prototype.parse = function (data) {
        for (let n = 0, m = data.length; n < m; n++) {
            let beg = this.parseDate(data[n][0]);
            let end = data[n].length === 4 ? this.parseDate(data[n][1]) : null;
            let lbl = data[n].length === 4 ? data[n][2] : data[n][1];
            let cat = data[n].length === 4 ? data[n][3] : data[n].length === 3 ? data[n][2] : 'default';
            if (beg.getFullYear() < this.year.min) {
                this.year.min = beg.getFullYear();
            }
            if (end && end.getFullYear() > this.year.max) {
                this.year.max = end.getFullYear();
            } else if (beg.getFullYear() > this.year.max) {
                this.year.max = beg.getFullYear();
            }
            this.data.push({start: beg, end: end, label: lbl, type: cat});
        }
    };
    TimeSheet.prototype.createBubble = function (wMonth, min, start, end) {
        return new Bubble(wMonth, min, start, end);
    };
    let Bubble = function (wMonth, min, start, end) {
        this.min = min;
        this.start = start;
        this.end = end;
        this.widthMonth = wMonth;
    };
    Bubble.prototype.formatMonth = function (num) {
        num = parseInt(num, 10);
        return num >= 10 ? num : '0' + num;
    };
    Bubble.prototype.getStartOffset = function () {
        return (this.widthMonth / 12) * (12 * (this.start.getFullYear() - this.min) + this.start.getMonth());
    };
    Bubble.prototype.getFullYears = function () {
        return ((this.end && this.end.getFullYear()) || this.start.getFullYear()) - this.start.getFullYear();
    };
    Bubble.prototype.getMonths = function () {
        let fullYears = this.getFullYears();
        let months = 0;
        if (!this.end) {
            months += !this.start.hasMonth ? 12 : 1;
        } else {
            if (!this.end.hasMonth) {
                months += 12 - (this.start.hasMonth ? this.start.getMonth() : 0);
                months += 12 * (fullYears - 1 > 0 ? fullYears - 1 : 0);
            } else {
                months += this.end.getMonth() + 1;
                months += 12 - (this.start.hasMonth ? this.start.getMonth() : 0);
                months += 12 * (fullYears - 1);
            }
        }
        return months;
    };
    Bubble.prototype.getWidth = function () {
        return (this.widthMonth / 12) * this.getMonths();
    };
    Bubble.prototype.getDateLabel = function () {
        return [
            (this.start.hasMonth ? this.formatMonth(this.start.getMonth() + 1) + '/' : '' ) + this.start.getFullYear(),
            (this.end ? '-' + ((this.end.hasMonth ? this.formatMonth(this.end.getMonth() + 1) + '/' : '' ) + this.end.getFullYear()) : '')
        ].join('');
    };
    window.TimeSheet = TimeSheet;
})();
class Bubble {
    constructor(ctx, w, h, opt) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.opt = opt;
        this.init(this.opt);
    }

    init(opt) {
        this.x = findRandom(0, this.w);
        this.y = findRandom(0, this.h);
        this.radius = findRandom(opt.radius_min, opt.radius_max);
        this.radius_change = findRandom(opt.radius_add_min, opt.radius_add_max);
        this.opacity = findRandom(opt.opacity_min, opt.opacity_max);
        this.opacity_change = findRandom(opt.opacity_prev_min, opt.opacity_prev_max);
        this.light = findRandom(opt.light_min, opt.light_max);
    }

    setColor(color) {
        this.color = 'hsl(' + color + ',100%,' + this.light + '%)';
    }

    draw() {
        this.opacity -= this.opacity_change;
        this.radius += this.radius_change;
        if (this.opacity <= 0) {
            this.init(this.opt);
        }
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = this.opacity;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
}

/*
function Bubble(ctx, w, h, opt) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.opt = opt;
    this.init(this.opt);
}

Bubble.prototype = {
    init: function (opt) {
        this.x = findRandom(0, this.w);
        this.y = findRandom(0, this.h);
        this.radius = findRandom(opt.radius_min, opt.radius_max);
        this.radius_change = findRandom(opt.radius_add_min, opt.radius_add_max);
        this.opacity = findRandom(opt.opacity_min, opt.opacity_max);
        this.opacity_change = findRandom(opt.opacity_prev_min, opt.opacity_prev_max);
        this.light = findRandom(opt.light_min, opt.light_max);
        // this.color = 'hsl(' + style_color + ',100%,' + this.light + '%)';
    },
    setColor: function (color) {
        this.color = 'hsl(' + color + ',100%,' + this.light + '%)';
    },
    draw: function () {
        this.opacity -= this.opacity_change;
        this.radius += this.radius_change;
        if (this.opacity <= 0) {
            this.init(this.opt);
        }
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = this.opacity;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
};*/

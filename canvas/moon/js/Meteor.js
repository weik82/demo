class Meteor {
    constructor(ctx, x, h, option) {
        this.ctx = ctx;
        this.x = x;
        this.y = 0;
        this.h = h;
        this.vx = -Meteor.randomInRange(option.min, option.max);
        this.vy = Meteor.randomInRange(option.min, option.max);
        this.len = Meteor.randomInRange(option.minLen, option.maxLen);
    }

    static randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    flow() {
        if (this.x < -this.len || this.y > this.h + this.len) {
            return false
        }
        this.x += this.vx;
        this.y += this.vy;
        return true
    }

    draw() {
        let ctx = this.ctx,
            gra = ctx.createRadialGradient(
                this.x, this.y, 0, this.x, this.y, this.len);

        const PI = Math.PI;
        gra.addColorStop(0, 'rgba(255,255,255,1)');
        gra.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.fillStyle = gra;
        ctx.beginPath();
        //流星头，二分之一圆
        ctx.arc(this.x, this.y, 1, PI / 4, 5 * PI / 4);
        //绘制流星尾，三角形
        ctx.lineTo(this.x + this.len, this.y - this.len);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}
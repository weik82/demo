class Moon {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.w = width;
        this.h = height;
    }

    draw() {
        let flag = this.w > this.h, x, y, r, r1;
        if (flag) {
            x = this.w * .2;
            y = this.h * .3;
            r = this.h * .1;
            r1 = this.w;
        } else {
            x = this.w * .3;
            y = this.h * .4;
            r = this.w * .1;
            r1 = this.h;
        }
        let gradient = this.ctx.createRadialGradient(x, y, r, x, y, r1);
        gradient.addColorStop(0, 'rgb(255,255,255)');
        gradient.addColorStop(0.01, 'rgb(70,70,80)');
        gradient.addColorStop(0.22, 'rgb(40,40,50)');
        gradient.addColorStop(0.5, 'rgb(20,20,30)');
        gradient.addColorStop(1, 'rgb(0,0,10)');
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.restore();
    }
}
class Moon {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    draw() {
        let ctx = this.ctx,
            flag = this.width > this.height, x, y, r, r1;
        if (flag) {
            x = this.height * .4;
            y = this.width * .2;
            r = this.height * .1;
            r1 = this.width;
        } else {
            x = this.width * .4;
            y = this.height * .2;
            r = this.width * .1;
            r1 = this.height;
        }
        let gradient = ctx.createRadialGradient(x, y, r, x, y, r1);
        //径向渐变
        gradient.addColorStop(0, 'rgb(255,255,255)');
        gradient.addColorStop(0.01, 'rgb(70,70,80)');
        gradient.addColorStop(0.2, 'rgb(40,40,50)');
        gradient.addColorStop(0.4, 'rgb(20,20,30)');
        gradient.addColorStop(1, 'rgb(0,0,10)');
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    }
}
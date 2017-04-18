class Stars {
    constructor(ctx, width, height, amount, r) {
        this.ctx = ctx;
        this.w = width;
        this.h = height;
        this.stars = this.init(amount, r);
    }

    init(amount, r) {
        let stars = [];
        while (amount--) {
            stars.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                r: Math.random() + r
            })
        }
        return stars;
    }

    draw() {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        this.ctx.restore();
    }

    blink() {
        this.stars.forEach(star => {
            let sign = Math.random() > 0.5 ? 1 : -1;
            star.r += sign * 0.5;
            if (star.r < 0) {
                star.r = -star.r;
            }
            if (star.r > 1.5) {
                star.r -= 0.3;
            }
        })
    }
}
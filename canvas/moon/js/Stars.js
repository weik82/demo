class Stars {
    constructor(ctx, width, height, amount) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.stars = this.init(amount);
    }

    init(amount) {
        let stars = [];
        while (amount--) {
            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() + 0.5
            })
        }
        return stars;
    }

    draw() {
        let ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'white';
        this.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
            ctx.fill();
        });
        ctx.restore();
    }

    //闪烁，星星半径每隔10帧随机变大或变小
    blink() {
        this.stars = this.stars.map(star => {
            let sign = Math.random() > 0.5 ? 1 : -1;
            star.r += sign * 0.3;
            if (star.r < 0) {
                star.r = -star.r;
            }
            if (star.r > 1.5) {
                star.r -= 0.3;
            }
            return star;
        })
    }
}
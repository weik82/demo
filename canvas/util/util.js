class Util {
    static captureMouse(canvas) {
        let mouse = {
            x: 0,
            y: 0
        };
        canvas.addEventListener('mousemove', (event) => {
            let rect = canvas.getBoundingClientRect(),
                x = event.clientX,
                y = event.clientY;
            mouse.x = (x - rect.top) * (canvas.width / rect.width);
            mouse.y = (y - rect.left) * (canvas.width / rect.width);
        }, false);
        return mouse;
    }
}
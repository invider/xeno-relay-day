const SIGNAL_SPEED = 30

let Signal = function(dat) {
    this.x = dat.x
    this.y = dat.y
    this.a = dat.a
    this.e = dat.e

    //this.a = Math.random() * Math.PI * 2
    this.dx = Math.sin(Math.PI - this.a) * SIGNAL_SPEED
    this.dy = Math.cos(Math.PI - this.a) * SIGNAL_SPEED
}

Signal.prototype.init = function() {
}

Signal.prototype.evo = function(dt) {
    this.e -= dt
    if (this.e <= 0) {
        this.alive = false
        this.__.detach(this)
    }

    this.x += this.dx * dt
    this.y += this.dy * dt
}

Signal.prototype.draw = function() {
    ctx.fillStyle = '#FFFF00'
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5 ,0,2*Math.PI);
    ctx.fill();
}

module.exports = function(dat) {
    return new Signal(dat)
}

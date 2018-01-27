let Signal = function(dat) {
    this.x = dat.x
    this.y = dat.y
    this.a = dat.a
    this.e = dat.e
}

Signal.prototype.init = function() {
}

Signal.prototype.evo = function(dt) {
    this.e -= dt
    if (this.e <= 0) {
        this.alive = false
        this.__.detach(this)
    }
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

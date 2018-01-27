const SIGNAL_SPEED = 30

let Signal = function(dat) {
    this.x = dat.x
    this.y = dat.y
    this.a = dat.a
    this.e = dat.e
    this.cmd = dat.cmd;

    //this.a = Math.random() * Math.PI * 2
    //this.dx = Math.sin(this.a) * SIGNAL_SPEED
    //this.dy = Math.cos(this.a) * SIGNAL_SPEED
    //this.a = Math.random() * Math.PI * 2
    this.dx = Math.sin(this.a - Math.PI) * SIGNAL_SPEED
    this.dy = Math.cos(this.a - Math.PI) * SIGNAL_SPEED
}

Signal.prototype.init = function() {
};

Signal.prototype.checkPlanetCollision = function(){
    var my = this;
    let star = $.lab._ls.find(obj => obj.type == "star" && $.lib.math.distance(my.x, my.y, obj.x, obj.y) <= obj.orbitR);
    if (star){
        star.applyCmd(this.cmd);
        this.__.detach(this);
    }
};

Signal.prototype.evo = function(dt) {
    this.e -= dt;
    if (this.e <= 0) {
        this.alive = false
        this.__.detach(this)
    }

    this.x += this.dx * dt
    this.y += this.dy * dt
    this.checkPlanetCollision();
};

Signal.prototype.draw = function() {
    ctx.fillStyle = this.cmd.color || '#FFFF00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5 ,0,2*Math.PI);
    ctx.fill();
};

module.exports = function(dat) {
    return new Signal(dat);
};

let Star = function(dat) {
    this.x = dat.x
    this.y = dat.y
    this.m = dat.m

    // setup color
    this.c = dat.c
    switch(this.c) {
    case 0: this.img = res['star-red']; break;
    case 1: this.img = res['star-blue']; break;
    case 2: this.img = res['star-yellow']; break;
    }

    _.log.debug('!!!!!!! created star')
    console.dir(dat)
}

Star.prototype.init = function() {
}
Star.prototype.evo = function(dt) {
}
Star.prototype.draw = function() {
    ctx.drawImage(this.img, this.x-this.m, this.y-this.m, this.m*2, this.m*2)
    ctx.beginPath();
    //ctx.arc(this.x,this.y,50,0,2*Math.PI);
    ctx.stroke();
}

module.exports = function(dat) {
    return new Star(dat)
}

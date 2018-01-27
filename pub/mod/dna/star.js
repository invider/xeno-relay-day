const ORBIT_DISTANCE = 10;
const STROKE_STYLE = "blue";
let Star = function (dat) {
    this.x = dat.x;
    this.y = dat.y;
    this.m = dat.m;

    // setup color
    this.c = dat.c;
    this.orbitR = this.m + ORBIT_DISTANCE;
    this.angle = dat.angle;

    switch (this.c) {
        case 0:
            this.img = res['star-red'];
            break;
        case 1:
            this.img = res['star-blue'];
            break;
        case 2:
            this.img = res['star-yellow'];
            break;
    }
    this.antennaImg = res['star-antenna'];

    _.log.debug('!!!!!!! created star');
    console.dir(dat);
};

Star.prototype.init = function () {
};
Star.prototype.evo = function (dt) {
};

Star.prototype.drawAntenna = function(){
    // let antennaX = this.x - this.antennaImg.width / 2;
    // let antennaY = this.y - this.antennaImg.height / 2;
    var res = lib.trigonometry.rotateLineAroundFirstDot(this.x, this.y, this.orbitR, this.angle);
    ctx.save();
    ctx.translate(res.x1, res.y1);
    ctx.rotate(Math.PI - this.angle);
    ctx.drawImage(this.antennaImg, -this.antennaImg.width / 2, -this.antennaImg.height / 2);
    ctx.restore()

};

Star.prototype.draw = function () {
    ctx.drawImage(this.img, this.x - this.m, this.y - this.m, this.m * 2, this.m * 2)
    this.drawAntenna();
    ctx.beginPath();
    ctx.strokeStyle = STROKE_STYLE;
    ctx.setLineDash([5, 3]);
    ctx.arc(this.x, this.y, this.orbitR, 0, 2 * Math.PI);
    ctx.stroke();
};

module.exports = function (dat) {
    return new Star(dat);
};

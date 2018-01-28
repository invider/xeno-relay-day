const SIGNAL_WIDTH = 10
const SIGNAL_MARGIN = 3;
let Legend = function(dat) {
    this.x = 10;
    this.y = 50;
    debugger;
};

Legend.prototype.init = function() {
    debugger;
};

Legend.prototype.evo = function(dt) {
};

Legend.prototype.drawLegendLine = function(cmd, y){
    ctx.fillStyle = cmd.color;
    ctx.font = SIGNAL_WIDTH + "px Arial";
    ctx.fillText(cmd.description,10,50);
    ctx.fillRect(this.x, this.y,  SIGNAL_WIDTH, SIGNAL_WIDTH);
};
Legend.prototype.draw = function() {

    ctx.beginPath();
    let y = this.y;
    for (let k in _.lib.constants.commands){
        this.drawLegendLine(_.lib.constants.commands[k], y);
        y += SIGNAL_WIDTH + SIGNAL_MARGIN;
    }
    ctx.stroke();
};

module.exports = function(dat) {
    return new Legend(dat);
};

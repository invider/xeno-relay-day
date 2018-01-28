const SIGNAL_WIDTH = 10
const SIGNAL_MARGIN = 3;
let Legend = function() {
    this.x = 10;
    this.y = 50;
};

Legend.prototype.init = function() {
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
    for (let k in $.lib.constants.commands){
        this.drawLegendLine($.lib.constants.commands[k], y);
        y += SIGNAL_WIDTH + SIGNAL_MARGIN;
    }
    ctx.stroke();
};

module.exports = new Legend();


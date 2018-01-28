const SIGNAL_WIDTH = 10
const LIST_WIDTH = 500;
const LIST_HEIGHT = 15;
let CommandList = function(dat) {
    this.x = dat.x;
    this.y = dat.y;
    //
    //  INFO: mandatory field
    //
    this.star = undefined;
};

CommandList.prototype.init = function() {

};

CommandList.prototype.evo = function(dt) {
};

CommandList.prototype.drawItem = function(){

};

CommandList.prototype.draw = function() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, LIST_WIDTH, LIST_HEIGHT);
    ctx.stroke();
    ctx.fill();
};

module.exports = function(dat) {
    return new CommandList(dat);
};

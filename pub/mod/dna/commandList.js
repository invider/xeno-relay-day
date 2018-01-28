const SIGNAL_WIDTH = 10
const LIST_WIDTH = 500;
const LIST_HEIGHT = 15;
const SIGNAL_MARGIN = 3;
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

CommandList.prototype.getItems = function() {
    return this.star.slice(0);
};


CommandList.prototype.drawItem = function(cmd, index){
    ctx.fillStyle = cmd.color;
    ctx.fillRect(this.x + (index * SIGNAL_WIDTH + SIGNAL_MARGIN), this.y, SIGNAL_WIDTH, SIGNAL_WIDTH);
};

CommandList.prototype.drawItems = function(){
    let items = this.getItems();
    for (var i = 0 ; i<items.length; i++){
        this.drawItem(items[i]);
    }
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

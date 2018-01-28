let defaults = {
    angle: 0,
    maxAngleDiff: 2 * Math.PI,
    c: 0
};
let setDefaults = function(star){
    var res = Object.assign({}, star);
    for (var k in defaults){
        if (res[k] == undefined){
            res[k] = defaults[k];
        }
    }
    return res;
};

module.exports = function(){
    let lvlData = _.lib.levels[$.env.gameInfo.level - 1];
    console.log("Level data:", lvlData);
    for (let k in lvlData.planets){
        sys.spawn('dna/star', 'lab', setDefaults(lvlData.planets[k]));
    }
    let start = sys.spawn('dna/star', 'lab', setDefaults(lvlData.start));
    start.startStar = true;
    let end = sys.spawn('dna/star', 'lab', setDefaults(lvlData.end));
    end.targetStar = true;
};
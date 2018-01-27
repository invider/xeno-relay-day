module.exports = function(){
    let lvlData = _.lib.levels[$.env.gameInfo.level - 1];
    console.log("Level data:", lvlData);
    for (let k in lvlData.planets){
        sys.spawn('dna/star', 'lab', lvlData.planets[k]);
    }
};
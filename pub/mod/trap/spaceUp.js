module.exports = function(e) {
    var res = _.lab.start.getEnergyStartPoint();
    sys.spawn('dna/signal', 'lab', {
        x: res.x,
        y: res.y,
        a: _.lab.start.angle,
        e: 5,
    })
}

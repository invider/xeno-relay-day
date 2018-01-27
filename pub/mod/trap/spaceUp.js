module.exports = function(e) {
    var res = _.lab.start.getEnergyStartPoint()
    sys.spawn('dna/signal', 'lab', {
        x: res.x,
        y: res.y,
        e: 5,
    })
}

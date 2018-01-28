module.exports = function() {
    _.log.debug('==== WIN ====')

    mod._ls[0].sys.spawn('dna/blinkingText', 'lab', {
        rx: 50,
        ry: 50,
        txt: 'Mission Successful',
    })
}

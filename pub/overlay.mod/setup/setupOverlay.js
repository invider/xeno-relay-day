module.exports = function(_) {
    _.log.debug('setup', ' ========= setting up the overlay')

    // show story
    sys.spawn('dna/scroll', 'lab', {
        x: 120,
        y: 150,
        txt: env.story,
        ttl: 20,
    })


};

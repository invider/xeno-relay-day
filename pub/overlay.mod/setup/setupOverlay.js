module.exports = function(_) {
    _.log.debug('setup', ' ========= setting up the overlay')

    // show story
    sys.spawn('dna/scroll', 'lab', {
        x: 600,
        y: 100,
        txt: env.story,
        ttl: 10,
    })
};

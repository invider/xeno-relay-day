module.exports = function(_) {
    _.log.debug('setup', 'setting up the game')

    // mod to hold text
    _.mod('overlay.mod')

    // add a mod layer to show statistics
    _.mod('fix/stat')

    /*
    // show story
    sys.spawn('dna/scroll', 'lab', {
        x: 600,
        y: 100,
        txt: env.story,
        ttl: 10,
    })
    */
}

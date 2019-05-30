module.exports = function() {
    log.debug('==== WIN ====')

    mod.overlay.sys.spawn('blinkingText', {
        rx: 50,
        ry: 50,
        txt: 'Mission Successful',
    })
}

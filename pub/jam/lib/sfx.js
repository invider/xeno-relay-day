module.exports = function(src, vol, pan) {
    if (!pan) pan = 0
    if (!vol) vol = 1

    if (!(src instanceof Audio)) {
        // find by path in resources
        src = res.selectOne(src)
    }

    if (src && src instanceof Audio) {
        src.volume = vol
        src.play()
    }
}


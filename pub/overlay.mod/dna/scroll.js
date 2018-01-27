module.exports = function(init) {

    // construct and return scrolling text
    return {
        x: init.x,
        y: init.y,
        h: 30,
        txt: init.txt,
        ttl: init.ttl,

        init: function() {
            this.txt = this.txt.split(/\r?\n/)
        },

        evo: function(dt) {
            this.ttl -= dt
            if (this.ttl < 0) this.alive = false
        },

        draw: function() {
            if (!this.alive) return 
            ctx.fillStyle = '#FFFF00'
            ctx.font = '24px zekton'

            for (let i = 0; i < this.txt.length; i++) {
                ctx.fillText(this.txt[i], this.x, this.y + this.h * i) 
            }
        },
    }
}

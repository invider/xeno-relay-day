
let STAR_FQ = 2

// star background
module.exports =  {

    stars: [],

    newStar: function() {
        let star = {
            a: true,
            c: this._.lib.math.rndi(3),
            x: this._.lib.math.rndi(this._.env.width),
            y: this._.lib.math.rndi(this._.env.height),
            s: 10 + this._.lib.math.rndi(20),
            m: 3 + this._.lib.math.rndi(15),
        }

        for (let i = 0; i < this.stars.length; i++) {
            if (!this.stars[i].a) {
                this.stars[i] = star
                return
            }
        }

        this.stars.push(star)
    },

    spawn: function() {
        for(let i = 0; i < 60*60; i++) {
            this.evo(0.015)
        }
    },

    evo: function(dt) {
        if (this._.lib.math.rndf() < STAR_FQ * dt) this.newStar()

        // move stars
        this.stars.forEach( star => {
            star.x -= star.s * dt
            if (star.x < 0) star.a = false
        })
    },

    draw: function() {
        // clear the screen
        ctx.fillStyle = "#250535"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // draw stars
        this.stars.forEach( star => {
            let img = res['star-blue']
            switch(star.c) {
            case 1: img = res['star-blue']; break;
            case 2: img = res['star-yellow']; break;
            }
            ctx.drawImage(img, star.x, star.y, star.m, star.m)
        })
    },
};


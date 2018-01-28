
this['core@sys'] = (function(window) {
    
return {
    _info: 'system functions',
    cp: function(source, target) {
        _.log.debug('copying ' + source + ' -> ' + target)

        let list = this._.select(source)
        if (list.length === 0) return false
        let dest 
        if (this._.sys.isString(target)) {
            dest = this._.select(target)
            if (dest.length !== 1) return false // can't copy if no node or more than one found
            dest = dest[0]
        } else {
            dest = target
        }

        if (!this._.sys.isFrame(dest)) return false
        list.forEach( function(e) {
            dest.attach(e)
        })
        return list.length
    },
    spawn: function(source, target, spawnData) {
        //this._.log.debug('~~~ spawning ' + source + ' -> ' + target)

        let cons = source
        if (this._.sys.isString(source)) {
            cons = this._.selectOne(source)
            if (!cons) throw "can't find the spawn dna: " + source
        }

        let dest = target
        if (!target || target === '') {
            dest = this._.lab
        } else if (this._.sys.isString(target)) {
            dest = this._.select(target)
            if (dest.length === 0) throw "can't find spawn target: " + target
            if (dest.length > 1) throw "ambiguous target for spawn: " + target
            dest = dest[0]
        }

        if (!this._.sys.isFrame(dest)) return false
        if (!this._.sys.isFun(cons)) return false

        if (/[A-Z]/.test(cons.name[0])) {
            // uppercase means constructor
            this._.log.debug('~~~ running new')
            let res = new cons(spawnData)
            dest.attach(res)
            return res
        } else {
            let res = cons(spawnData)
            dest.attach(res)
            return res
        }
    }
}

})(this)


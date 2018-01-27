$ = scene = (function(window) {

"use strict"

// ***********
// environment
let canvasName = 'canvas'

// *********
// utilities
var isObj = function(o) {
    return !!(o && typeof o === 'object')
}
var isFun = function(f) {
    return !!(f && f.constructor && f.call && f.apply);
}
var isString = function(s) {
    return toString.call(s) == "[object String]"
}
var isNumber = function(s) {
    return toString.call(s) == "[object Number]"
}
var isArray = function(a) {
    return Array.isArray(a)
}
var isMutable = function(obj) {
    return ((typeof obj === 'object')
                || (typeof obj === 'function'))
            && (!obj._locked);
}
var isFrame = function(f) {
    return !!(f && f._frame)
}

var mix = function() {
    var arg, prop, mixin = {};
    for (arg = 0; arg < arguments.length; arg++) {
        for (prop in arguments[arg]) {
            if (arguments[arg].hasOwnProperty(prop)) {
                mixin[prop] = arguments[arg][prop];
            }
        }
    }
    return mixin;
}
var augment = function() {
    var arg;
    var prop;
    var mixin = arguments[0];
    for (arg = 1; arg < arguments.length; arg++) {
        for (prop in arguments[arg]) {
            mixin[prop] = arguments[arg][prop];
        }
    }
    return mixin;
}

var before = function(obj, fun, patch) {
    var orig = obj[fun]
    obj[fun] = function() {
        patch.apply(this, arguments)
        orig.apply(this, arguments)
    }
}

var after = function(obj, fun, patch) {
    var orig = obj[fun]
    obj[fun] = function() {
        orig.apply(this, arguments)
        patch.apply(this, arguments)
    }
}


// ******************
// system definitions
var Frame = function(initObj) {
    this._ = this
    this._ls = []
    this._dir = {}
    if (isString(initObj)) {
        this.name = initObj
    } else if (isObj(initObj)) {
        augment(this, initObj)
    }
}
Frame.prototype._frame = true
Frame.prototype.type = "frame"
Frame.prototype.path = function() {
    if (this.__) return this.__.path() + '/' + this.name
    return '/' + this.name
}
Frame.prototype.touch = function(path) {
    if (path === undefined) return
    if (this._locked) throw new Error("can't touch - node is locked")

    // normalize path
    if (path.startsWith('@')) path = path.substring(1)
    if (path.startsWith('/')) path = path.substring(1)

    let i = path.indexOf('/')
    if (i >= 0) {
        // switch to the next target
        let nextName = path.substring(0, i)
        let nextPath = path.substring(i + 1)
        let nextNode = this[nextName]
        if (!nextNode) {
            // provide a new one
            return this.attach(new Frame(nextName)).touch(nextPath)
        }
    } else {
        // we got the name
        return this.attach(new Frame(path))
    }
}
Frame.prototype.attach = function(node, name) {
    if (node === undefined) return
    if (this._locked) throw { src: this, msg: "can't attach - node is locked" }
    if (isObj(node) || isFun(node)) {
        node._ = this._
        node.__ = this
        if (name && isObj(node)) node.name = name
        if (!name && node.name) name = node.name
	}

    if (name) {
        this[name] = node
        this._dir[name] = node
    }
    this._ls.push(node)
    if (isFun(node.init)) node.init() // initialize node
    this.onAttached(node, name, this)
    return node
};
Frame.prototype.onAttached = function(node, name, parent) {
    this.__.onAttached(node, name, parent)
};
Frame.prototype.detach = function(node) {
    node.__.detachByName(node.name);
};
Frame.prototype.detachAll = function() {
    while(this._ls.length){
        let node = this._ls[0];
        node.__.detachByName(node.name);
    }
};
Frame.prototype.detachByName = function(name) {
    var obj = this[name];
    if (obj === undefined){
        throw new Error("No node with name:" + name);
    }
    if (this[name].finish) this[name].finish()

    delete this[name];
    delete this._dir[name];
    let index = this._ls.indexOf(obj);
    if (index === -1){
        throw new Error("No such object in ls:" + name);
    }
    this._ls.splice(index, 1);
};

Frame.prototype.apply = function(fn, predicate) {
    let i = 0
    if (isFun(predicate)) {
		this._ls.forEach( function(e) {
			if (predicate(e)) {
                fn(e)
                i++
            }
		})
    } else if (isString(predicate)) {
        let ls = this.select(predicate)
        ls.forEach( function(e) {
            fn(e)
            i++
        })
    } else {
		this._ls.forEach( function(e) {
            fn(e)
            i++
        })
    }
    return i
}
Frame.prototype.collide = function(fn, predicate) {
    let i = 0
    if (isFun(predicate)) {
        let ls = this._ls
		ls.forEach( function(e) {
			if (predicate(e)) {
                ls.forEach( function(o) {
                    if (predicate(o)) {
                        if (e !== o) fn(e, o)
                    }
                })
            }
		})
    } else if (isString(predicate)) {
        let ls = this.select(predicate)
        ls.forEach( function(e) {
            ls.forEach( function(o) {
                if (e !== o) fn(e, o)
                i++
            })
        })
    } else {
        let ls = this._ls
		ls.forEach( function(e) {
            ls.forEach( function(o) {
                if (e !== o) fn(e, o)
                i++
            })
        })
    }
    return i
}
Frame.prototype.map = function(fn) {
}
Frame.prototype.flatMap = function(fn) {
}
Frame.prototype.reduce = function(fn) {
}
Frame.prototype.select = function(predicate) {
	if (isString(predicate)) {
		// select by path
		if (predicate === '') {
			// select the dir
			return this._ls.slice()
		}

		let i = predicate.indexOf('/')
		if (i > 0) {
			let nextName = predicate.substring(0, i)
			let nextPath = predicate.substring(i + 1)
			if (nextName == '..') {
				// move up
				if (!this.__) return []
				return this.__.select(nextPath)
			}

			let res = []
			for (let k in this) {
				let o = this[k]
				if (o && nextName === '*' || k.includes(nextName) || (o.tag && o.tag.includes(nextName))) {
					if (isFrame(o)) {
						res = res.concat(o.select(nextPath))
					} else if (isArray(o)) {
						if (nextPath === '' || nextPath === '*') res = res.concat(o)
						// TODO maybe handle index identifiers?
					} else if (isObj(o)) {
						for (let j in o) {
							if (nextPath === '*' || j.includes(nextPath)) {
								res.push(o[j])
							}
						}
					}
				}
				
			}
			return res

		} else if (i === 0) {
			return _scene.select(predicate.substring(1))
		} else {
			// found the point
			if (predicate === '..') {
				// move up
				if (!this.__) return []
				return this.__
			} else if (predicate === '*') return this._ls.slice()

			let res = []
			for (let k in this._dir) {
				let o = this._dir[k]
				if (k.includes(predicate) || (o.tag && o.tag.includes(predicate))) res.push(o)
			}
			return res
		}

		/*
        // switch to the next target
       return _scene.patch(nextNode, nextPath, node)
    // found the patch point - attach the node
    if (isFrame(target)) {
        if (path === '') {
            target.attach(node)
        } else {
            if (target[path]) {
                augment(target[path], node)
            } else {
                target.attach(node, path)
            }
        }
    } else if (isArray(target)) {
        target.push(node)
    } else if (isObj(target)) {
        if (path === '') throw { src: this, msg: "can't attach anonymous node to " + target }
        if (target[path]) {
            console.log('augmenting: ' + path)
            augment(target[path], node)
        } else {
            console.log('rewriting: ' + path)
            target[path] = node
        }
    }
		*/

	} else if (isFun(predicate)) {
        return this._ls.filter(predicate)
	} else return []
}
Frame.prototype.selectOne = function(predicate) {
	let list = this.select(predicate)
	if (list.length > 0) return list[0]
	return undefined
};

Frame.prototype.selectOneNumber = function(predicate) {
    let list = this.select(predicate)
    if (list.length > 0) {
        if (isNaN(list[0])){
            throw new Error("Error parsing number:" + list[0])
        }
        return parseFloat(list[0]);
    }
    return 0;
}

Frame.prototype.kill = function() {
    this._ls.map(function(node) {
        if (isFun(node.kill)) node.kill()
    })
}

// Mod context container
var Mod = function(initObj) {
    Frame.call(this, initObj)
    this._$ = _scene
    this.ctx = false
    this.focus = true

    // resources container
    this.attach(new Frame({
        name: 'res',
        _included: 0,
        _loaded: 0,
        onAttached: function(node, name, parent) {
            if (isString(node)) {
                if (name) {
                    // the name for the node is specified, so put under that one
                    let rs = this._.load(node)
                    parent.attach(rs, name)
                } else {
                    // no name for the node, load to filename
                    this._.load(node, parent)
                }
            
            } else if (isArray(node)) {
                // load resource group
                let _ = this._
                let rgroup = []
                // load
                node.forEach( function(e) {
                    rgroup.push(_.load(e))
                })
                // push
                node.splice(0)
                rgroup.forEach( function(e) {
                    node.push(e)
                })
            } else {
                // just ignore - that probably already loaded resource node
            }
        }
    }))
    // library functions
    this.attach(new Frame({
        name: "lib",
    }))
    // prototypes/constructors
    this.attach(new Frame({
        name: 'dna',
    }))

    // augment functions
    // TODO remove in favor of .aug
    this.attach(new Frame({
        name: "aug",
    }))

    // static environment data entities
    this.attach(new Frame({
        name: "env",
        started: false,
    }))
    // container for acting entities - actors, ghosts, props
    this.attach(new Frame({
        name: 'lab',
        onAttached: function(node) {
            //this._.log.debug('spawned ' + node.name)
            // normalize and augment the node
            node.alive = true
            if (!isFun(node.draw)) node.draw = false
            if (!isFun(node.evo)) node.evo = false
            if (isFun(node.spawn)) node.spawn()

            this._.aug._ls.forEach( function(aug) {
                aug(node)
            })
        }
    }))

    // container for mods
    var mod = function mod(path, name) {
        if (!name) {
            let i = path.lastIndexOf('/')
            if (i >= 0) name = path.substring(i+1)
            else name = path
        }
        let nmod = this.mod.attach(new Mod(), name)
        nmod.fix(nmod, path, 'fix')
    }
    augment(mod, new Frame())

    mod.touch = function(path) {
        if (path === undefined) return
        if (this._locked) throw new Error("can't touch - node is locked")

        // normalize path
        if (path.startsWith('@')) path = path.substring(1)
        if (path.startsWith('/')) path = path.substring(1)

        let i = path.indexOf('/')
        if (i >= 0) {
            // switch to the next target
            let nextName = path.substring(0, i)
            let nextPath = path.substring(i + 1)
            let nextNode = this[nextName]
            if (!nextNode) {
                // provide a new one
                return this.attach(new Mod(nextName)).touch(nextPath)
            }
        } else {
            // we got the name
            return this.attach(new Mod(path))
        }
    }
    this.attach(mod)

    // container for traps
    var trap = function trap(key, data, chain) {
        var fn = this.trap[key]
        if (isFun(fn)) {
            fn(data)
        }

        if (chain) {
            // propagate event
            this.mod._ls.forEach( m => {
                m.trap(key, data, chain)
            })
        }
    }
    augment(trap, new Frame())
    this.attach(trap)
}

Mod.prototype = new Frame()

Mod.prototype.init = function() {
    this.___ = this._ // save node context as parent mod
    this._ = this // must be in init, since it is assigned during the regular node.attach()
    this.attach(new Frame(this.___.sys)) // clone sys from parent mod
    this.attach(new Frame(this.___.log)) // clone log from parent mod
    this.ctx = this.___.ctx // clone draw context from parent mod
}

Mod.prototype.onAttached = function(node, name, parent) {
    if (this.__) this.__.onAttached(node, name, parent)
}

Mod.prototype.evo = function(dt) {
    // evolve all entities in the lab
    this.lab._ls.map( function(e) {
        if (e.evo && !e.dead && !e.paused) e.evo(dt)
    });

    // evolve all mods
    this.mod._ls.map( function(m) {
        if (m.evo && !m.paused) m.evo(dt)
    });
}

Mod.prototype.draw = function() {
    if (!this.ctx) return

    if (!this.env.started) {
        if (this.res._included > _scene.res._loaded) {
            // wait more and show boot nodes
            if (isFrame(this.boot)) {
                for (let i = 0; i < this.boot._ls.length; i++) {
                    let e = this.boot._ls[i]
                    if (isFun(e.draw)) {
                        e.draw()
                    }
                }
            }
        }  else {
            // OK - everything is loaded, call setup functions
            if (isFrame(this.setup)) {
                this.setup._ls.forEach(f => {
                    f(_scene)
                })
            }
            this.env.started = true
        }
    }


    // draw entities in the lab
    // we might integrate this mod display as a link in the mod list
    for (let i = 0; i < this.lab._ls.length; i++) {
        let e = this.lab._ls[i]
        if (e.draw && !e.dead && !e.hidden) {
            e.draw()
        }
    }

    // draw mods
    for (let i = 0; i < this.mod._ls.length; i++) {
        let m = this.mod._ls[i]
        if (m.draw && !m.hidden) {
            m.draw()
        }
    }
}
Mod.prototype.scan = function(target) {
    // normalize target
    if (!isObj(target)) target = window

    // search for declarations
    for (var key in target) {
        if (key.startsWith('_boot$')) {
            let node = target[key]
            if (isFun(node)) {
                _scene.log.debug('executing: ' + key)
                node(_scene)
                target[key] = false
            }

        } else if (key.startsWith('_patch$')) {
            let node = target[key]
            if (node) {
                let path = ''
                if (node._$patchAt) {
                    path = node._$patchAt
                    if (!path.endsWith('/')) path += '/'
                }
                for (var pkey in node) {
                    if (!pkey.startsWith('_')) {
                        let fullPath = path + pkey
                        let val = node[pkey]
                        if (val) {
                            _scene.log.debug('~~ ' + fullPath + ' << ' + (val._info? val._info : (val.name? val.name : '')))
                            _scene.patch(_scene, fullPath, val)
                        }
                    }
                }
                target[key] = false
            }
            
        } else if (key.indexOf('@') >= 0) {
            let node = target[key]
            if (node) {
                let path = key.substring(key.indexOf('@') + 1)
                _scene.log.debug('~~ ' + path + ' << ' + (node._info? node._info : (node.name? node.name : '')))
                _scene.patch(_scene, path, target[key])
                target[key] = false
            }
        } else if (key.startsWith('_$') && node && isString(node._$patchAt)) {
            let path = node._$patchAt
            _scene.log.debug('~~ ' + path + ' << ' + (val._info? val._info : (val.name? val.name : '')))
            _scene.patch(_scene, fullPath, val)
        }
        /*
        } else if (key.startsWith('_lib$')) {
            var node = target[key]
            var name = key.substring(4, key.length)
            if (node.name !== undefined) {
                name = node.name
            }
            _scene.patch('lib', name, node)
            target[key] = "loaded"

        } else if (key.startsWith('_env$')) {
            var node = target[key]
            var name = key.substring(4, key.length)
            if (node.name !== undefined) {
                name = node.name
            }
            _scene.patch('env', name, node)
            target[key] = "loaded"

        } else if (key.startsWith('_lab$')) {
            var node = target[key]
            var name = key.substring(4, key.length)
            if (node.name !== undefined) {
                name = node.name
            }
            _scene.patch('lab', name, node)
            target[key] = "loaded"
        }
        */
    }
}
Mod.prototype.patch = function(target, path, node) {
    //console.log('....patching @' + path + ' for ' + target.name)

    if (!isMutable(target)) throw { src: this, msg: "can't attach to imutable node @" + path }

    if (path.startsWith('@')) path = path.substring(1)
    if (path.startsWith('/')) path = path.substring(1)

    if (path === '') {
        // patch point is a directory - find if node is named
        if (node && isString(node.name)) {
            path = node.name
        }
    }

    let i = path.indexOf('/')
    if (i >= 0) {
        // switch to the next target
        let nextName = path.substring(0, i)
        let nextPath = path.substring(i + 1)
        let nextNode = target[nextName]
        if (!nextNode) {
            // provide a new one

            if (isFrame(target)) {
                target.touch(nextName)
            } else if (isObj(target) || isFun(target)) {
                nextNode = {}
                target[nextName] = nextNode
            } else {
                this.log.err('unable to patch @' + path + ' - unable to attach [' + nextName + '] to parent')
                return false
            }
        } else if (!isFrame(nextNode) && !isObj(nextNode)) {
            this.log.err('unable to patch @' + path + ' - [' + nextName + '] is not valid for patching')
            return false
        } else {
            return this.patch(nextNode, nextPath, node)
        }
    }

    if (node !== undefined) {
        // found the patch point - attach the node
        if (isFrame(target)) {
            if (path === '') {
                target.attach(node)
            } else {
                if (isObj(target[path])) {
                    augment(target[path], node)
                } else if (target[path] !== undefined) {
                    // already defined - replace
                    // TODO doesn't work property for frames - _dir and _ls stays the same
                    target[path] = node
                    target._dir[path] = node
                } else {
                    target.attach(node, path)
                }
            }
        } else if (isArray(target)) {
            target.push(node)
        } else if (isObj(target)) {
            if (path === '') throw { src: this, msg: "can't attach anonymous node to " + target }
            if (isObj(target[path])) {
                augment(target[path], node)
            } else if (target[path] !== undefined) {
                // TODO doesn't work property for frames - _dir and _ls stays the same
                target[path] = node
                target._dir[path] = node
            }
        }

        // load resources if applicable
        if (isFun(node.load)) {
            node.load(this)
            node.load = true // replace function with true, so we'd not call it second time
        }
    }
}
Mod.prototype.load = function(src, base, path, ext) {
    var _ = this

    function onLoad() {
        _.res._loaded++
    }

    // normalize extention
    if (!ext) ext = src.slice((Math.max(0, src.lastIndexOf(".")) || Infinity) + 1).toLowerCase();

    let srcName = src.replace(/^.*[\\\/]/, '') // remove path
    srcName = srcName.replace(/\.[^/.]+$/, '') // remove extension
    let name = srcName

    let pathName
    if (path) {
        pathName = path.replace(/^.*[\\\/]/, '') // remove path
        name = pathName
    }

    if (ext === 'png' || ext === 'jpeg' || ext === 'jpg') {
        _.log.out('loader', 'loading image @' + path + ': ' + src)
        _.res._included ++
        var img = new Image()
        img.src = src
        img.onload = onLoad
        _.patch(base, path, img)
        //if (isFrame(target)) target.attach(img, name)
        //else if (isObj(target)) target[name] = img

        return img

    } else if (ext === 'ttf') {

    } else if (ext === 'wav') {
        _.log.out('loader', 'loading sfx @' + path + ': ' + src)
        var node = new Audio(src);
        node.preload = true;
        node.loop = false;
        node.autoplay = false;

        if (base) _.patch(base, path, node)
        //if (isFrame(target)) target.attach(node, name)
        //else if (isObj(target)) target[name] = node
        return node

    } else if (ext === 'ogg') {

    } else if (ext === 'json') {
        // TODO how to load that? only AJAX?
    } else if (ext === 'yaml') {
        // TODO how to load that? only AJAX?
    } else if (ext === 'txt') {
        _.log.debug('loader', 'loading text @' + src)
        
        _.res._included ++
        let usrc = src + "?" + Math.random() // fix possible cache issue

        var ajax = new XMLHttpRequest()
        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // file is loaded
                let txt = this.responseText
                _.patch(base, path, txt)
                _.res._loaded ++
            }
        }
        ajax.open("GET", src, true);
        ajax.send();
    } else if (ext === 'csv') {
        // TODO how to load that? only AJAX?
    } else if (ext === 'js') {
        this.log.debug('loader', 'loading script: ' + src)

        this.res._included ++
        let usrc = src + "?" + Math.random() // fix possible cache issue

        /*
        var script = document.createElement('script');
        script.onload = function onLoadScript(e) {
            _.res._loaded++
            _.log.debug('jam', 'scanning: ' + src + ' loaded: ' + _.res._loaded + '/' + _.res._included)
            _.scan()    
        }
        //script.type = 'text/javascript'
        //script.type = 'text/jam'
        //script.async = false
        script.src = usrc
        document.head.appendChild(script);

        return script
        */

        // can't use ajax on local resources
        var ajax = new XMLHttpRequest()
        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // script is loaded
                // place in context and execute
                let code = this.responseText
                //try {
                    var scope = {}
                    var module = {}

                    // provide lexical scope for mod context and scope object for this. definitions
                    code = '(function ' + name + '(_, ctx, module, sys, lib, res, dna, env, lab, mod, log) {'
                        + code
                    + '}).call(scope, _, _.ctx, module, _.sys, _.lib, _.res, _.dna, _.env, _.lab, _.mod, _.log)'

                    let val = eval(code)

                    //_.log.debug('jam', 'scanning: ' + src + ' loaded: ' + _.res._resLoaded + '/' + _.res._resIncluded)
                    _.scan(scope)
                    // fix the mode if there is a value
                    if (val) {
                        //_.log.debug('loader', 'we have a value @' + path)
                        _.patch(base, path, val)
                    } else if (module.exports) {
                        // no value is reture - try to find a value
                        _.patch(base, path, module.exports)
                    }
                //} catch (e) {
                //    _scene.log.err('jam-loader', 'error in [' + src + ']' + e)
                //    throw e
                //}
                _.res._loaded ++
            }
        }
        ajax.open("GET", src, true);
        ajax.send();
        // TODO we might return some kind of promise of a container for future value?
    } else {
        _.log.debug('loader', 'ignoring resource: [' + src + ']')
    }
}
Mod.prototype.fix = function(target, base, ignore) {
    // get and process new topology for the given base at the target node
    this.log.debug('loader', 'fix ' + target.name + ' @' + base)
    this.res._included++

    var currentMod = this
    var ajax = new XMLHttpRequest()
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // topology is loaded
            // place in context and execute
            let topology = JSON.parse(this.responseText)
            topology.forEach(src => {
                if (src.startsWith(base)) {
                    let path = src.substring(base.length)
                    if (ignore && path.startsWith(ignore)) {
                        _scene.log.debug('loader', 'ignoring fix: [' + src + ']')
                    } else {
                        path = path.replace(/\..+$/, '');
                        currentMod.load(src, target, path)
                    }
                }
            })
            currentMod.res._loaded++
        }
    }
    ajax.open("GET", 'topology', true);
    ajax.send();
}

// ***********************
// scene tree construction
var _scene = new Mod()
_scene.name = '/'
_scene._ = _scene // set the context
_scene._$ = _scene // root context
_scene.__ = false // don't have any parents
_scene.___ = _scene// parent context

_scene.path = function() {
    return ''
}

// ***
// log
_scene.attach(new Frame({
    name: 'log',
    err: function(msg, post) {
        post? console.log('! [' + msg + '] ' + post) : console.log('! ' + msg) 
        console.dir(msg)
    },
    out: function(msg, post) {
        post? console.log('> [' + msg + '] ' + post) : console.log('> ' + msg) 
    },
    debug: function(msg, post) {
        post? console.log('# [' + msg + '] ' + post) : console.log('# ' + msg) 
    },
    dump: function(obj) {
        console.dir(obj)
    },
}))

_scene.attach(new Frame({
    name: 'setup'
}))


_scene.packDeclarations = function(target) {
    // normalize target
    if (!isObj(target)) target = window

    var pak = {}
    target['_def$'] = pak

    // search for declarations
    for (var key in target) {
        if (key.startsWith('_boot$') || key.startsWith('_patch$') || key.indexOf('@') >= 0) {
            pak[key] = target[key]
            target[key] = false
        }
    }
}

  
// ********************************************
// sys functions
_scene.attach(new Frame({
    name: "sys",
}))
_scene.sys.attach(Frame)
_scene.sys.attach(mix)
_scene.sys.attach(augment)
_scene.sys.attach(before)
_scene.sys.attach(after)
_scene.sys.attach(_scene.load)

_scene.sys.attach(isObj)
_scene.sys.attach(isFun)
_scene.sys.attach(isNumber)
_scene.sys.attach(isString)
_scene.sys.attach(isArray)
_scene.sys.attach(isMutable)
_scene.sys.attach(isFrame)

_scene.env.TARGET_FPS = 60
_scene.env.MAX_EVO_STEP = 0.01
_scene.env.MAX_EVO_PER_CYCLE = 0.3
_scene.env.lastFrame = Date.now()
_scene.env.mouseX = 0
_scene.env.mouseY = 0
_scene.env.keys = {}  // down key set




// *****************************************************
// LIFECYCLE
// main scene lifecycle - bootstrap, cycle[evo, draw]
//
function bootstrap() {
    console.log('*** [jam] booting up ***')
    // binding to the graphical context by convention
    let canvas = document.getElementById(canvasName)
    if (canvas == null) {
        // precreated canvas is not found, so create one
        canvas = document.createElement(canvasName);
        canvas.id = canvasName;
        canvas.style.zIndex   = 1;
        canvas.style.border   = "0px";
        canvas.style.margin = "0px";
        canvas.style.padding = "0px";
        canvas.style.position = "absolute";
        canvas.style.display = "block";
        document.body.appendChild(canvas);

        // style body
        document.body.style.margin = "0"
        document.body.style.padding = "0"
    }
    _scene.ctx = canvas.getContext("2d")

    // pack existing declarations in global scope first
    _scene.packDeclarations()

    // load jam root mod
    _scene.fix(_scene, _scene.env.syspath, 'fix')
    // load default rot mod
    _scene.fix(_scene, 'mod', 'fix')

    // scan global just in case of some definitions there
    _scene.scan()

    // load custom declarations packed before
    // TODO - maybe a better way to postpone it? scripts are loaded async
    //        so we need an event when core is loaded for that
    _scene.scan(window._def$)
    
    
    //canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT); //Chrome
    //canvas.mozRequestFullScreen(); //Firefox
    //canvas.msRequestFullscreen();
    //canvas.requestFullscreen();

    expandCanvas(canvasName)
    focus()
    setInterval(focus, 100)

    // initiate the game loop
    console.log('*** [jam] starting main cycle ***')
    window.requestAnimFrame(cycle)
    /*
    // old-fasioned way to setup animation
    if (_scene.env.TARGET_FPS <= 0) {
        setInterval(cycle, 1)
    } else {
        setInterval(cycle, 1000/_scene.env.TARGET_FPS)
    }
    */
}

// > implement 'keepOriginalAspectRatio'&'aspectRatio' option
function expandCanvas(name) {
    var canvas = document.getElementById(name)
    var newWidth = window.innerWidth
    var newHeight = window.innerHeight
    _scene.env.width = _scene.ctx.width = canvas.width = newWidth
    _scene.env.height = _scene.ctx.height = canvas.height = newHeight
    canvas.style.width = newWidth + 'px'
    canvas.style.height = newHeight + 'px'
    _scene.draw() // it doesn't work without forced redraw
}

function expandView() {
    // TODO modify to support multiple canvases and custom resize
    expandCanvas(canvasName)
}


// ******************************************************
function cycle() {
    var now = Date.now()
    var dt = (now - _scene.env.lastFrame)/1000

    // loading/setup actions
    // TODO make loading screen mod possible
    /*
    if (!_scene.env.started) {
        try {
            if (_scene.res._resIncluded > _scene.res._resLoaded) {
                // wait more
            }  else {
                // OK - everything is loaded, call setup functions
                _scene.setup._ls.forEach(function(f) {
                    f(_scene)
                })
                _scene.env.started = true
            }
            window.requestAnimFrame(cycle)
        } catch (e) {
            _scene.log.err(e)
        }
        return
    }
    */

    // show, react and update cycle
    _scene.draw()

    // max evolution threshold
    if (dt > _scene.env.MAX_EVO_PER_CYCLE) {
        dt = _scene.env.MAX_EVO_PER_CYCLE
    }

    // evolve multiple times in small quants
    // to compensate possible lag due to rendering delays
    while(dt > 0) {
        if (dt > _scene.env.MAX_EVO_STEP) {
            _scene.evo(_scene.env.MAX_EVO_STEP);
        } else {
            _scene.evo(dt);
        }
        dt -= _scene.env.MAX_EVO_STEP
    }
    _scene.env.lastFrame = now
	window.requestAnimFrame(cycle)
}



// ***************
// events handling
//

function handleMouseMove(e) {
    e = e || window.event
    _scene.env.mouseX = e.pageX
    _scene.env.mouseY = e.pageY
    e.preventDefault()
    e.stopPropagation()
    return false;
}

function handleMouseDown(e) {
    e.preventDefault()
    e.stopPropagatton = e.button
    return false;
}

function handleMouseClick(e) {
    _scene.trap('click', e, true)
}

function handleMouseUp(e) {
}

function handleMouseDoubleClick(e) {
    switch (e.button) {
    case 0: 
            break;
    case 1:
            break;
    case 2:
            break;
    }
    e.preventDefault()
    e.stopPropagatton = e.button
    return false;
}

function handleMouseOut(e) {
    for (var k in _scene.env.keys) {
        delete _scene.env.keys[k]
    }
}

function handleContextMenu() {
    return false;
}

function handleKeyDown(e) {
    var code = e.which || e.keyCode

    _scene.env.keys[code] = 1

    e.preventDefault()
    e.stopPropagation()
    return false;
}

function handleKeyUp(e) {
    var code = e.which || e.keyCode
    delete _scene.env.keys[code]

    e.preventDefault()
    e.stopPropagation()
    return false;
}


// *****************
// setup environment

// determine system path
let scripts = document.getElementsByTagName('script')
// TODO actually we need fix.js script tag in particular
for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.endsWith('fix.js')) {
        let path = scripts[i].src.split('?')[0]
        let syspath = path.split('/').slice(0, -1).join('/')+'/'
        let htmlpath = location.href.split('/').slice(0, -1).join('/')+'/'
        if (syspath.startsWith(htmlpath)) {
            // we can shorten the syspath to a relative value
            syspath = syspath.substring(htmlpath.length)
        }
        _scene.env.basepath = htmlpath
        _scene.env.syspath = syspath
    }
}

function focus() {
    window.focus()
}

// bind events to target
function bindHandlers(target) {
    if (!target) return
    target.onresize = expandView
    target.onload = bootstrap
    target.onmousedown = handleMouseDown
    target.onmouseup = handleMouseUp
    target.onclick = handleMouseClick
    target.onmouseout = handleMouseOut
    target.ondblclick = handleMouseDoubleClick
    target.oncontextmenu = handleContextMenu
    target.onmousemove = handleMouseMove
    target.onkeydown = handleKeyDown
    target.onkeyup = handleKeyUp
}
bindHandlers(window)


// extend window with universal requestAnimFrame
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback, element) {
            window.setTimeout(callback, 1000/60);
         };
})();

return _scene;

}(window))

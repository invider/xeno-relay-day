'use strict'

var fs = require('fs')
var lib = require('./lib')

var basepath = 'pub'

let top = JSON.stringify(lib.survey('', basepath))
console.log(top)
fs.writeFile(basepath + '/topology', top, err => {
    if (err) console.log(err)
    else console.log('=== Saved ===')
})


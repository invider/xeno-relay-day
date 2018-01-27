'use strict'
var express = require('express');
var app = express();
var ws = require('express-ws')(app);
var lib = require('./lib')

// settings
var port = 8000
var basepath = 'pub'
var dynamic = true

const args = process.argv;
for (let i = 2; i < args.length; i++) {
    if (args[i] === 'static') dynamic = false
}

// static http
app.use(express.static(basepath));

if (dynamic) {
    app.get('/topology', function(req, res) {
        let ls = lib.survey('', basepath)
        console.log('topology: ')
        console.log(ls)
        res.json(ls)
    });
} else {
    console.log('serving only static content')
}


app.listen(port);
console.log('[http server] Listening at ' + port + '...');


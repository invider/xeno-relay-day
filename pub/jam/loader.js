"use strict" 
this._boot$ = function(_) {
    // load all dna and libraries
    _.log.debug('load.js',  'loading libraries...')

    _.load(_.env.syspath + 'sys.js')
    _.load(_.env.syspath + 'lib/math.js')
};


module.exports = function(){
    lab.start.applyCmd(lib.constants.commands.EOT);
    lab.start.execSequence();
    lib.sfx('sfx/sequence', 0.4)
    lib.sfx(res.sfx.sequence, 0.4)
    return false;
};

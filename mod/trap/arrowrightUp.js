module.exports = function(){
    lab.start.applyCmd(lib.constants.commands.ROTATE_RIGHT);
    lib.sfx(res.sfx['select-2'], 0.4)
    return false;
};

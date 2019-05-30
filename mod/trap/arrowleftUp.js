module.exports = function () {
    lab.start.applyCmd(lib.constants.commands.ROTATE_LEFT)
    lib.sfx(res.sfx['select-1'], 0.4)
    return false;
};

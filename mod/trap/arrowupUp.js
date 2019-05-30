module.exports = function(){
    lab.start.applyCmd(lib.constants.commands.SEND_TO_NEXT_PLANET);
    lib.sfx(res.sfx['select-3'], 0.4)
    return false;
};

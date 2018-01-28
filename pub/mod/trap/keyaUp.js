module.exports = function () {
    console.log("rotating")
    //_.lab.start.rotateAntenna(_.lib.constants.ROTATE_ANGLE);
    _.lab.start.applyCmd(_.lib.constants.commands.ROTATE_LEFT)
};
module.exports = function(){
    _.lab.start.applyCmd(_.lib.constants.commands.EOT);
    _.lab.start.execSequence();
    return false;
};

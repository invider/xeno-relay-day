module.exports = function(){
    console.log("sending sequence");
    _.lab.start.applyCmd(_.lib.constants.commands.EOT);
    _.lab.start.execSequence();
    return false;
};

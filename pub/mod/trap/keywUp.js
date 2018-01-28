module.exports = function(){
    console.log("sending sequence");
    _.lab.start.applyCmd(_.lib.constants.commands.FIX_STAR);
    _.lab.start.execSequence();
};
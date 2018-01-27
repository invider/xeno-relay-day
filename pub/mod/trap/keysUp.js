module.exports = function(){
    console.log("sending sequence");
    _.lab.start.sequence = [
        _.lib.constants.commands.ROTATE_LEFT,
        _.lib.constants.commands.ROTATE_LEFT,
        _.lib.constants.commands.ROTATE_LEFT,
        _.lib.constants.commands.SEND_TO_NEXT_PLANET,
        _.lib.constants.commands.ROTATE_RIGHT,
        _.lib.constants.commands.ROTATE_RIGHT,
        _.lib.constants.commands.ROTATE_RIGHT,
        _.lib.constants.commands.SEND_TO_NEXT_PLANET,
        _.lib.constants.commands.ROTATE_RIGHT,
        _.lib.constants.commands.SEND_TO_NEXT_PLANET,
        _.lib.constants.commands.FIX_STAR
    ];
    _.lab.start.execSequence();
};
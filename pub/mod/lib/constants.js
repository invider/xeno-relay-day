module.exports = {
    commands:{
        ROTATE_LEFT:{
            color:'#FFFF00',
            description:"Rotate transmitter left"
        },
        ROTATE_RIGHT:{
            color:'#FF0000',
            description:"Rotate transmitter right"
        },
        SEND_TO_NEXT_PLANET:{
            color:'#00FF00',
            description:"Send sequence to next planet"

        },
        EOT:{
            color:'#0000FF',
            description:"End of transmission"
        }
    },
    ROTATE_ANGLE: Math.PI / 6
};

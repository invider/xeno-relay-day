/** @typedef {{x:number, y:number, m:number, angle:number, maxAngleDiff:number, c:number}} Planet
/**
 * @type {[{name:string, description:string, start:Planet, end:Planet, planets:[Planet]}]}
 */

const HOUR = Math.PI / 6;

let rfi = function() {
    return Math.floor((Math.random() * 12)) * HOUR
}

module.exports = [
    {
        name:"Try to solve",
        description:"",

        start:{
            x:80, y:80,
            m:35, c:3,
            name: "start",
            angle: 9 * HOUR,
        },
        end:{
            x:15, y:25,
            //x:55, y:84,
            m:30, c:2,
            name: "target",
            angle: 8 * HOUR,
        },

        planets:[
            {
                x:35, y:25,
                m:20, c:1,
                angle: rfi(),
            }, {
                x:11, y:50,
                m:19, c:0,
                angle: rfi(),
            }, {
                x:42, y:10,
                m:22, c:1,
                angle: rfi(),
            }, {
                x:62, y:40,
                m:33, c:0,
                angle: rfi(),
            }, {
                x:42, y:50,
                m:23, c:1,
                angle: rfi(),
            }, {
                x:30, y:35,
                m:24, c:0,
                angle: rfi(),
            }, {
                // earth-like close planet
                x:70, y:60,
                m:28, c:0,
                angle: rfi(),
            }, {
                x:85, y:28,
                m:25, c:0,
                angle: rfi(),
            }, {
                x:66, y:15,
                m:25, c:0,
                angle: rfi(),
            }, {
                x:20, y:70,
                m:26, c:1,
                angle: rfi(),
            }, {
                x:58, y:68,
                m:30, c:1,
                angle: rfi(),
            },
        ]
    }
];

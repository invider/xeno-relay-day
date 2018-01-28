/** @typedef {{x:number, y:number, m:number, angle:number, maxAngleDiff:number, c:number}} Planet
/**
 * @type {[{name:string, description:string, start:Planet, end:Planet, planets:[Planet]}]}
 */

const HOUR = Math.PI / 6;

module.exports = [
    {
        name:"Try to solve",
        description:"",
        start:{
            x:80,
            y:80,
            m:35,
            c:3,
            name: "start"
        },
        end:{
            x:15,
            y:15,
            m:30,
            c:2,
            name: "target"
        },

        planets:[
            {
                x:35, y:25,
                m:15, c:1,
                angle: 5 * HOUR
            }, {
                x:11, y:34,
                m:15, c:0,
                angle:6 * HOUR
            }, {
                x:42, y:10,
                m:15, c:1,
                angle:7 * HOUR
            }, {
                x:62, y:40,
                m:20, c:0,
                angle:7 * HOUR
            }, {
                x:42, y:50,
                m:20, c:1,
                angle:7 * HOUR
            }, {
                x:30, y:35,
                m:15, c:0,
                angle:7 * HOUR
            },
        ]
    }
];

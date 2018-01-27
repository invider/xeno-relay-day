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
            x:250,
            y:200,
            m:25,
            c:1,
            name: "start"
        },
        end:{
            x:75,
            y:125,
            m:35,
            c:0,
            name: "target"
        },
        planets:[
            {
                x:350,
                y:250,
                m:20,
                c:0,
                angle:5 * HOUR
            },
            {
                x:110,
                y:340,
                m:25,
                c:0,
                angle:6 * HOUR
            },
            {
                x:420,
                y:100,
                m:35,
                c:0,
                angle:7 * HOUR
            },
            {
                x:620,
                y:400,
                m:35,
                c:0,
                angle:7 * HOUR
            },
            {
                x:420,
                y:500,
                m:35,
                c:1,
                angle:7 * HOUR
            },
            {
                x:300,
                y:350,
                m:35,
                c:0,
                angle:7 * HOUR
            },
        ]
    }
];

/** @typedef {{x:number, y:number, type:string, angle:number, maxAngleDiff:number}} Planet
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
            type:"start"
        },
        end:{
            x:75,
            y:125,
            m:35,
            c:0,
            type:"end"
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
                angle:5 * HOUR
            },
            {
                x:420,
                y:100,
                m:35,
                c:0,
                angle:5 * HOUR
            }
        ]
    }
];

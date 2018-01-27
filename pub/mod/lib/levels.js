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
            x:100,
            y:100,
            type:"start"
        },
        end:{
            x:20,
            y:20,
            type:"end"

        },
        planets:[
            {
                x:50,
                y:50,
                angle:5 * HOUR
            },
            {
                x:40,
                y:40,
                angle:5 * HOUR
            },
            {
                x:50,
                y:50,
                angle:5 * HOUR
            }
        ]
    }
];
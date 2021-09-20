import { LoopOnce, LoopRepeat } from "three";
import { IAnimationBindingConfig } from "../webgl/types";

export default ([
    {
        name: 'small-houseAction',
        matching: 'exact',
        trigger: ['click'],
        loop: LoopOnce,
        mesh: [{
            name: 'small-house',
            matching: 'partial',
        }]
    },
    {
        name: 'roofAction',
        matching: 'exact',
        trigger: ['hover'],
        loop: LoopRepeat,
        mesh: [{
            name: 'ring',
            matching: 'partial',
        }]
    },
    {
        name: 'penthouseAction',
        matching: 'partial',
        trigger: ['hover'],
        loop: LoopRepeat,
        mesh: [{
            name: 'tower',
            matching: 'partial',
        }]
    },
    {
        name: 'ringAction.001',
        matching: 'exact',
        trigger: ['hover'],
        loop: LoopOnce,
        mesh: [{
            name: 'ring',
            matching: 'partial',
        }]
    },
] as IAnimationBindingConfig[]);
import { LoopOnce } from "three";
import { IAnimationBindingConfig } from "../webgl/types";

export default ([
    {
        name: 'small-houseAction',
        matching: 'exact',
        trigger: ['click', 'hover'],
        loop: LoopOnce,
        mesh: [{
            name: 'small-house',
            matching: 'partial',
        }]
    }
] as IAnimationBindingConfig[]);
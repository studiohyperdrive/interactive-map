import { LoopOnce, MathUtils, AnimationAction } from "three";
import { IAnimationConfig } from "@shd-developer/interactive-map/dist/types";

export default ([
    {
        name: 'small-house',
        matching: 'partial',
        loop: LoopOnce,
        startAnimation: (animationAction: AnimationAction, i: number) => {         
            console.log('start');
            
            setTimeout(() => {
                animationAction
                .reset()
                .play();
                setInterval(() => {
                    animationAction
                    .reset()
                    .play();
                }, MathUtils.randInt(5000, 10000));
            }, MathUtils.randInt(1000, 5000))
        }
    },
] as IAnimationConfig[]);
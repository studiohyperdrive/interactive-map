import { LoopOnce, MathUtils, AnimationAction } from 'three';
import { IAnimationConfig } from '@studiohyperdrive/interactive-map/dist/types';

export const animationConfig = [
    {
        name: 'chicken',
        matching: 'partial',
        loop: LoopOnce,
        startAnimation: (animationAction: AnimationAction, i: number) => {
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
    {
        name: 'cow',
        matching: 'partial',
        loop: LoopOnce,
        startAnimation: (animationAction: AnimationAction, i: number) => {
            setTimeout(() => {
                animationAction.reset().play();
                setInterval(() => {
                    animationAction.reset().play();
                }, MathUtils.randInt(5000, 10000));
            }, MathUtils.randInt(1000, 5000));
        },
    },
    {
        name: 'goat',
        matching: 'partial',
        loop: LoopOnce,
        startAnimation: (animationAction: AnimationAction, i: number) => {
            setTimeout(() => {
                animationAction.reset().play();
                setInterval(() => {
                    animationAction.reset().play();
                }, MathUtils.randInt(5000, 10000));
            }, MathUtils.randInt(1000, 5000));
        },
    },
    {
        name: 'sheep',
        matching: 'partial',
        loop: LoopOnce,
        startAnimation: (animationAction: AnimationAction, i: number) => {
            setTimeout(() => {
                animationAction.reset().play();
                setInterval(() => {
                    animationAction.reset().play();
                }, MathUtils.randInt(5000, 10000));
            }, MathUtils.randInt(1000, 5000));
        },
    },
    /* {
        name: 'fountain',
        matching: 'partial',
        loop: LoopOnce,
        startAnimation: (animationAction: AnimationAction, i: number) => {
            setTimeout(() => {
                animationAction.reset().play();
                setInterval(() => {
                    animationAction.reset().play();
                }, MathUtils.randInt(5000, 10000));
            }, MathUtils.randInt(1000, 5000));
        },
    }, */
] as IAnimationConfig[];

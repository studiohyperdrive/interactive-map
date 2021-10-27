import { AnimationClip } from "three";

import { IAnimate } from "../types";

import { isMatching } from "./bindings";

export const handleBindingAnimations = (
    bindings: IAnimate[],
    animations: AnimationClip[],
    callback: (animation: AnimationClip, animationBinding: IAnimate) => void
) => {
    bindings.forEach((binding) => {
        animations.forEach(animation => {
            if (isMatching(animation, binding)) {
                callback(animation, binding);
            }
        });
    });
}
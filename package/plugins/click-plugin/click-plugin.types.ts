import { AnimationClip, AnimationMixer } from "three";

import { IAnimate, IBindingConfig, IEventPlugin } from "../../types";

export interface IClickPlugin extends IEventPlugin {
    animations: AnimationClip[],
    mixer: AnimationMixer,
    handleClick: (e: MouseEvent) => void,
    handleBindingAnimation: (binding: IBindingConfig, callback: (animation: AnimationClip, animationBinding: IAnimate) => void) => void,
}
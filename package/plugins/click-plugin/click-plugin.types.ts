import { AnimationClip, AnimationMixer } from "three";

import { IAnimate, IBindingConfig, IEventPlugin } from "../../types";

export interface IClickPlugin extends IEventPlugin {
    animations: AnimationClip[],
    mixer: AnimationMixer,
    bindEventListener: () => void,
    unbindEventListener: () => void,
    handleClick: (e: MouseEvent) => void,
    handleBindingAnimation: (binding: IBindingConfig, callback: (animation: AnimationClip, animationBinding: IAnimate) => void) => void,
}
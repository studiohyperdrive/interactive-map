import { AnimationClip, AnimationMixer, Mesh } from "three";
import { IEventPlugin, IBindingConfig, IAnimate } from "../../types";

export interface IHoverPlugin extends IEventPlugin {
    animations: AnimationClip[],
    mixer: AnimationMixer,
    hovered: Mesh | null,
    bindEventListener: () => void,
    unbindEventListener: () => void,
    handleHover: (e: MouseEvent) => void,
    handleBindingAnimation: (binding: IBindingConfig, callback: (animation: AnimationClip, animationBinding: IAnimate) => void) => void,
}
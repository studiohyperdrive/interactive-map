import { AnimationClip, AnimationMixer, Mesh } from "three";
import { BindingCallback, IBindingConfig, IEventPlugin } from "../../types";

export interface IHoverPlugin extends IEventPlugin {
    animations: AnimationClip[],
    mixer: AnimationMixer,
    hovered: Mesh | null,
    handleHover: (e: MouseEvent) => void,
}

export interface IHoverBindingConfig extends IBindingConfig {
    onHoverStart: BindingCallback,
    onHoverEnd: BindingCallback,
}
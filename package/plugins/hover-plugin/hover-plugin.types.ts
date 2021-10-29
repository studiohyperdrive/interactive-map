import { AnimationClip, AnimationMixer, Mesh } from "three";
import { BindingCallback, IBindingConfig, IEventPlugin } from "../../types";

export interface IHoverPlugin extends IEventPlugin {
    animations: AnimationClip[];
    bindings: IHoverBindingConfig[];
    hovered: Mesh | null;
    mixer: AnimationMixer;
    handleHover: (e?: MouseEvent) => void;
}

export interface IHoverBindingConfig extends IBindingConfig {
    onHoverStart: BindingCallback;
    onHoverEnd: BindingCallback;
}
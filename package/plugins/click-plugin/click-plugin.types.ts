import { AnimationClip, AnimationMixer } from "three";

import { BindingCallback, IBindingConfig, IEventPlugin } from "../../types";

export interface IClickPlugin extends IEventPlugin {
    animations: AnimationClip[],
    mixer: AnimationMixer,
    handleClick: (e: MouseEvent) => void,
}

export interface IClickBindingConfig extends IBindingConfig {
    onClick: BindingCallback,
}
import { AnimationClip, AnimationMixer } from "three";
import { IBindingConfig, IEventPlugin } from "../../types";

export interface IClickPlugin extends IEventPlugin {
    animations: AnimationClip[],
    mixer: AnimationMixer,
    handleClick: (e: MouseEvent) => void,
    isMatching: (item: {name: string}, binding: IBindingConfig) => boolean,
}
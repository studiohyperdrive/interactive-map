import { AnimationClip, AnimationMixer, Mesh } from "three";
import { IEventPlugin, IBindingConfig } from "../../types";

export interface IHoverPlugin extends IEventPlugin {
    animations: AnimationClip[],
    mixer: AnimationMixer,
    hovered: Mesh | null,
    handleHover: (e: MouseEvent) => void,
    isMatching: (item: {name: string}, binding: IBindingConfig) => boolean,
}
import { AnimationClip, AnimationMixer, Scene } from "three";
import { IAnimationConfig, IBindingConfig, IScenePlugin } from "../../types";

export interface IAnimationPlugin extends IScenePlugin {
    mixer: AnimationMixer,
    animationsStarted: boolean,
    startAnimations: (animations: AnimationClip[], animationConfig: IAnimationConfig[]) => void,
    isMatching: (item: {name: string}, binding: IBindingConfig) => boolean,
}
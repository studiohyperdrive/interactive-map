import { AnimationClip, AnimationMixer } from "three";

import { IAnimationConfig, IScenePlugin } from "../../types";

export interface IAnimationPlugin extends IScenePlugin {
    mixer: AnimationMixer,
    animationsStarted: boolean,
    startAnimations: (animations: AnimationClip[], animationConfig: IAnimationConfig[]) => void,
}
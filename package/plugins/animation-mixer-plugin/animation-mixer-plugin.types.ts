import { AnimationMixer, Scene } from "three";
import { IScenePlugin } from "../../types";

export interface IAnimationMixerPlugin extends IScenePlugin {
    scene: Scene,
    mixer: AnimationMixer,
}
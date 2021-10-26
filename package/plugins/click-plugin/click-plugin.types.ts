import { AnimationClip, AnimationMixer } from "three";

import { IEventPlugin } from "../../types";

export interface IClickPlugin extends IEventPlugin {
    animations: AnimationClip[],
    mixer: AnimationMixer,
    handleClick: (e: MouseEvent) => void,
}
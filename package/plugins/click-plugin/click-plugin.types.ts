import { AnimationClip, AnimationMixer } from "three";

import { IEventPlugin } from "../../types";

export interface IClickPlugin extends IEventPlugin {
    animations: AnimationClip[],
    mixer: AnimationMixer,
    bindEventListener: () => void,
    unbindEventListener: () => void,
    handleClick: (e: MouseEvent) => void,
}
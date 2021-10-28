import { AnimationClip, AnimationMixer, Scene } from "three";

import { IEventPlugin, IBindingConfig, BindingCallback } from "../../types";

export interface ITabNavigationPlugin extends IEventPlugin {
    scene: Scene;
    animations: AnimationClip[];
    bindings: ITabNavigationBindingConfig[];
    current?: ITabNavigationBindingConfig;
    mixer: AnimationMixer;

    listeners: {
        tab: EventListener,
        shiftTab: EventListener
    }

    handleTabPress(e: KeyboardEvent): void
    handleShiftTabPress(e: KeyboardEvent): void
    navigate(e: KeyboardEvent, forward: boolean): void
}

export interface ITabNavigationBindingConfig extends IBindingConfig {
    afterNavigate?: BindingCallback
    boundingBoxScale?: number
    order: number
}
import { Camera, Raycaster, Scene } from "three";

import { IEventPlugin } from "../../types";

export interface IRacasterPlugin extends IEventPlugin {
    raycaster: Raycaster,
    camera: Camera,
    scene: Scene,
    handleClick: () => void,
}

// Config

export interface IRaycasterConfig {
    trigger: "click" | "mousemove",
}
import { Camera, Raycaster, Scene } from "three";

import { IScenePlugin } from "../../types";

export interface IRaycasterPlugin extends IScenePlugin {
    raycaster: Raycaster,
    camera: Camera,
    scene: Scene,
    handleClick: () => void,
}

export interface IRaycasterConfig {
    trigger: "click" | "mousemove",
}
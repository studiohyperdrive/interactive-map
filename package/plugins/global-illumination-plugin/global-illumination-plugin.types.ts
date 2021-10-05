import { Scene } from "three";

import { IScenePlugin, ILight } from "../../types";

export interface IGlobalIlluminationPlugin extends IScenePlugin {
    scene: Scene,
    addLights: (scene: Scene, lights: ILight[]) => void,
}
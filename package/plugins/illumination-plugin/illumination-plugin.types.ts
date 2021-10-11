import { Light, Scene } from "three";

import { IScenePlugin, ILight } from "../../types";

export interface IIlluminationPlugin extends IScenePlugin {
    scene: Scene,
    lights: Light[],
    addLights: (scene: Scene, lights: ILight[]) => Light[]
}

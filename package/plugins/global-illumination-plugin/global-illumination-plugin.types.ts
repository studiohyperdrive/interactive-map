import { AmbientLight, DirectionalLight, Scene } from "three";

import { IScenePlugin } from "../../types";

export interface IGlobalIlluminationPlugin extends IScenePlugin {
    scene: Scene,
    addLights: () => void,
    createAmbient: () => AmbientLight,
    createDirectional: () => DirectionalLight,
}
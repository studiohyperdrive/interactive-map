import { IUpdates } from "../../../types";

export interface IGlobalIllumination extends IUpdates {
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;

    createAmbient(): THREE.AmbientLight;
    createDirectional(): THREE.DirectionalLight;
}
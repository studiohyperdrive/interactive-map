import { AmbientLight, DirectionalLight } from "three";

import { IUpdates } from "../../../types";

export interface IGlobalIllumination extends IUpdates {
    ambient: AmbientLight;
    directional: DirectionalLight;

    createAmbient(): AmbientLight;
    createDirectional(): DirectionalLight;
}
import { OrthographicCamera, PerspectiveCamera } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import { IScenePlugin } from "../../types";

export interface ICameraLerpPlugin extends IScenePlugin {
    controls: MapControls;
    camera: PerspectiveCamera | OrthographicCamera;
    isAnimating: () => boolean;
}

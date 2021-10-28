import { OrthographicCamera, PerspectiveCamera } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import { IScenePlugin } from "../../types";

export interface ICameraLerpPlugin extends IScenePlugin {
    camera: PerspectiveCamera | OrthographicCamera;
    controls: MapControls;
    isAnimating: () => boolean;
}

import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import { IScenePlugin } from "../../types";

export interface ITabNavigationTransitionPlugin extends IScenePlugin {
    controls: MapControls
}

import { Scene } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { IScenePlugin } from "../../types";

export interface IGltfDracoLoaderPlugin extends IScenePlugin {
    scene: Scene,
    dracoLoader: DRACOLoader,
    gltfLoader: GLTFLoader,
    loadGltf: (path: string) => void,
}
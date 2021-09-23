import { Group, Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import IInteractiveMap from "./interactive-map.types";

export default class InteractiveMap implements IInteractiveMap {
    public dracoLoader: DRACOLoader;
    public loader: GLTFLoader;
    public instance: Group | null = null;

    constructor(scene: Scene, path: string) {
        // Add draco loader
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('decoder/');

        // Add loader
        this.loader = new GLTFLoader();
        this.loader.setDRACOLoader(this.dracoLoader);

        // Add map to schene
        this.loader.load(path, (gltf) => {
            this.instance = gltf.scene;
            scene.add(gltf.scene);
        });
    }

    public update() {}
};
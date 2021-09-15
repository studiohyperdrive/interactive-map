import { Group, Mesh, Object3D, Scene } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { IClickBindingConfig } from '../../../types';
import { IInteractiveMap } from './interactive-map.types';

export default class InteractiveMap implements IInteractiveMap {
    public loader: GLTFLoader;
    public instance: Group | null = null;

    constructor(scene: Scene, path: string, click: IClickBindingConfig[]) {
        // Add loader
        this.loader = new GLTFLoader();

        // Add map to schene
        this.loader.load(path, (gltf) => {
            this.instance = gltf.scene;
            scene.add(gltf.scene);
        });
    }

    public update() {
        if (this.instance) {
            this.instance.rotation.y -= 0.001;
        };
    }
};
import { Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { IGltfDracoLoaderPlugin } from "./gltf-draco-loader-plugin.types";

export class GltfDracoLoaderPlugin {
    constructor(path: string, afterLoad?: Function) {
        return class implements IGltfDracoLoaderPlugin {
            private dataStore: IDataStore;

            public scene: Scene;
            public dracoLoader: DRACOLoader;
            public gltfLoader: GLTFLoader;

            public afterLoad: Function | undefined = afterLoad;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.dataStore.set(constants.store.mapLoaded, false);
                this.dataStore.set(constants.store.animations, []);

                this.scene = this.dataStore.get(constants.store.scene);

                this.dracoLoader = new DRACOLoader();
                this.dracoLoader.setDecoderPath('decoder/');

                this.gltfLoader = new GLTFLoader();
                this.gltfLoader.setDRACOLoader(this.dracoLoader);

                this.loadGltf(path);
            }

            public loadGltf(path: string) {
                this.gltfLoader.load(path, (gltf) => {
                    this.dataStore.set(constants.store.animations, gltf.animations);

                    this.scene = this.scene.add(gltf.scene);

                    if (this.afterLoad) {
                        this.afterLoad(this.scene);
                    }

                    this.dataStore.set(constants.store.scene, this.scene);
                    this.dataStore.set(constants.store.mapLoaded, true);
                });
            }

            public update() { }
        }
    }
}

export default GltfDracoLoaderPlugin;
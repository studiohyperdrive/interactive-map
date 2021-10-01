import { AnimationClip, AnimationMixer, Scene } from "three";
import { IBindingConfig, IAnimationConfig } from "../../types";
import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";
import { IGltfDracoLoaderPlugin } from "./gltf-draco-loader-plugin.types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export default class GltfDracoLoaderPlugin {
    constructor(path: string) {
        return class implements IGltfDracoLoaderPlugin{
            private dataStore: IDataStore;

            public scene: Scene;
            public dracoLoader: DRACOLoader;
            public gltfLoader: GLTFLoader;

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;

                dataStore.set("mapLoaded", false);
                dataStore.set("animations", []);

                this.scene = dataStore.get("scene");
                
                this.dracoLoader = new DRACOLoader();
                this.dracoLoader.setDecoderPath('decoder/');

                // Add loader
                this.gltfLoader = new GLTFLoader();
                this.gltfLoader.setDRACOLoader(this.dracoLoader);

                this.loadGltf(path);
            }

            public loadGltf(path: string) {
                this.gltfLoader.load(path, (gltf) => {                    
                    this.dataStore.set("animations", gltf.animations);            
                    this.scene.add(gltf.scene);
                    this.dataStore.set("mapLoaded", true);                      
                });
            }

            public update() {}
        }
    }
}
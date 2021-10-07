import { AmbientLight, DirectionalLight, Scene } from "three";

import { IDataStore } from "../../data-store/data-store.types";

import { IGlobalIlluminationPlugin } from "./global-illumination-plugin.types";

export class GlobalIlluminationPlugin {
    constructor() {
        return class implements IGlobalIlluminationPlugin {
            private dataStore: IDataStore;

            public scene: Scene;
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.scene = dataStore.get("scene");
                this.addLights()
            }

            public addLights() {
                const ambient = this.createAmbient();
                const directional = this.createDirectional();

                this.scene.add(ambient);
                this.scene.add(directional);
            }

            public createAmbient() {
                return new AmbientLight(0xffffff, 0.5);
            }
        
            public createDirectional() {
                const light = new DirectionalLight(0xffffff, 1);
                light.position.set(1, 1, 0.2);
        
                return light;
            }

            public update() {}
        }
    }
}

export default GlobalIlluminationPlugin;
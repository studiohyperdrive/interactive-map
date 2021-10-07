import { Scene } from "three";

import { IIlluminationConfig, ILight } from "../../types";
import { IDataStore } from "../../data-store/data-store.types";

import { IGlobalIlluminationPlugin } from "./global-illumination-plugin.types";

export class GlobalIlluminationPlugin {
    constructor() {
        return class implements IGlobalIlluminationPlugin {
            private dataStore: IDataStore;

            public scene: Scene;
            public illuminationConfig: IIlluminationConfig;
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.scene = this.dataStore.get("scene");
                this.illuminationConfig = this.dataStore.get("illuminationConfig");

                if (this.illuminationConfig && this.illuminationConfig.lights) {
                    this.addLights(this.scene, this.illuminationConfig.lights);
                }
            }

            public update() { }

            public addLights(scene: Scene, lights: ILight[]) {
                lights.forEach((light: ILight) => {
                    const lightSetup = light.setup;

                    if (light.position) {
                        lightSetup.position.setX(light.position.x);
                        lightSetup.position.setY(light.position.y);
                        lightSetup.position.setZ(light.position.z);
                    }

                    scene.add(lightSetup);
                });
            }
        }
    }
}

export default GlobalIlluminationPlugin;
import { Light, Scene } from "three";

import { IIlluminationConfig, ILight } from "../../types";
import { IDataStore } from "../../data-store/data-store.types";

import { IIlluminationPlugin } from "./illumination-plugin.types";

export class IlluminationPlugin {
    constructor(config?: IIlluminationConfig) {
        return class implements IIlluminationPlugin {
            private dataStore: IDataStore;

            public config?: IIlluminationConfig = config;

            public scene: Scene;
            public lights: Light[] = [];

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.scene = this.dataStore.get("scene");

                if (config) {
                    if (config.lights) {
                        this.lights = this.addLights(this.scene, config.lights);
                    }
                }
            }

            public update() { }

            public addLights(scene: Scene, lights: ILight[]): Light[] {
                return lights.map((light: ILight) => {
                    const instance = light.setup;

                    if (light.position) {
                        instance.position.setX(light.position.x);
                        instance.position.setY(light.position.y);
                        instance.position.setZ(light.position.z);
                    }

                    scene.add(instance);

                    return instance;
                });
            }
        }
    }
}

export default IlluminationPlugin;
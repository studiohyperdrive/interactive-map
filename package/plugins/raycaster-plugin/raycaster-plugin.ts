import { Camera, Raycaster, Scene } from "three";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { IRaycasterPlugin, IRaycasterConfig } from "./raycaster-plugin.types";

export class RaycasterPlugin {
    constructor(config: IRaycasterConfig) {
        return class implements IRaycasterPlugin {
            private dataStore: IDataStore;

            public raycaster: Raycaster;
            public camera: Camera;
            public scene: Scene;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;
                this.raycaster = new Raycaster();

                this.camera = dataStore.get(constants.store.camera);
                this.scene = dataStore.get(constants.store.scene);
            }

            public bindEventListener() {
                window.addEventListener(config.trigger, this.handleClick);
            }

            public unbindEventListener() {
                window.removeEventListener(config.trigger, this.handleClick);
            }

            public handleClick = () => {
                const pos = this.dataStore.get(constants.store.mousePosition);

                if (pos === undefined) {
                    this.dataStore.set(constants.store.intersection, []);
                    return
                };
        
                this.raycaster.setFromCamera(pos, this.camera);
        
                this.dataStore.set(constants.store.intersection, this.raycaster.intersectObjects(this.scene.children, true)[0]);                
            }
        }
    }
}

export default RaycasterPlugin;
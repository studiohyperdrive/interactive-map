import { Camera, Raycaster, Scene } from "three";

import { IDataStore } from "../../data-store/data-store.types";
import { IRacasterPlugin, IRaycasterConfig } from "./raycaster-plugin.types";

export default class RaycasterPlugin {
    constructor(config: IRaycasterConfig) {
        return class implements IRacasterPlugin {
            private dataStore: IDataStore;

            public raycaster: Raycaster;
            public camera: Camera;
            public scene: Scene;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;
                this.raycaster = new Raycaster();

                this.camera = dataStore.get("camera");
                this.scene = dataStore.get("scene");
            }

            public bindEventListener() {
                window.addEventListener(config.trigger, this.handleClick);
            }

            public unbindEventListener() {
                window.removeEventListener(config.trigger, this.handleClick);
            }

            public handleClick = () => {
                const pos = this.dataStore.get("mousePosition");
                if (pos === undefined) {
                    return
                };
        
                this.raycaster.setFromCamera(pos, this.camera);
        
                this.dataStore.set('intersection', this.raycaster.intersectObjects(this.scene.children, true)[0]);                
            }
        }
    }
}
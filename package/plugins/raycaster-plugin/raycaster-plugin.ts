import { Camera, Raycaster, Scene } from "three";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { IRaycasterPlugin, IRaycasterConfig } from "./raycaster-plugin.types";
import { flattenChildren } from "../../utils";

export class RaycasterPlugin {
    constructor(config: IRaycasterConfig) {
        return class implements IRaycasterPlugin {
            private dataStore: IDataStore;

            public raycaster: Raycaster;
            public camera: Camera;
            public scene: Scene;

            public listener: EventListener;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;
                this.raycaster = new Raycaster();

                this.camera = this.dataStore.get(constants.store.camera);
                this.scene = this.dataStore.get(constants.store.scene);

                this.listener = this.handleClick.bind(this) as EventListener;
            }

            public bindEventListener() {
                window.addEventListener(config.trigger, this.listener);
            }

            public unbindEventListener() {
                window.removeEventListener(config.trigger, this.listener);
            }

            public handleClick() {
                const pos = this.dataStore.get(constants.store.mousePosition);

                if (pos === undefined) {
                    this.dataStore.set(constants.store.intersection, []);
                    return
                };

                this.raycaster.setFromCamera(pos, this.camera);

                const visible = flattenChildren(this.scene.children);
                const intersected = this.raycaster.intersectObjects(visible, true).filter(i => i.object.visible)[0];

                this.dataStore.set(constants.store.intersection, intersected);
            }
        }
    }
}

export default RaycasterPlugin;
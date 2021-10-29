import { ICameraLerpPlugin, IHoverPlugin, IRaycasterPlugin } from "..";

import { IDataStore } from "../../data-store/data-store.types";

import { ICameraLerpSynchroniserPlugin } from "./camera-lerp-synchroniser-plugin.types";

/**
 * This plugin will be detected by ThreeEntryPoint at construct-time and will look for the instances of the plugins it aims to "glue" together
 */
export class CameraLerpSynchroniserPlugin {
    constructor(
        lerp?: ICameraLerpPlugin,
        raycaster?: IRaycasterPlugin,
        hover?: IHoverPlugin
    ) {
        return class implements ICameraLerpSynchroniserPlugin {
            private dataStore: IDataStore;

            public lerp: ICameraLerpPlugin | undefined = lerp;
            public raycaster: IRaycasterPlugin | undefined = raycaster;
            public hover: IHoverPlugin | undefined = hover;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;
            }

            update() {
                if (!this.lerp || !this.raycaster) {
                    return;
                }

                if (this.lerp.isAnimating()) {
                    this.raycaster.handleCast();
                    this.hover?.handleHover();
                }
            }
        }
    }
}

export default CameraLerpSynchroniserPlugin;
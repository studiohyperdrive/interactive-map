import { OrthographicCamera, PerspectiveCamera, WebGLRenderer } from "three";

import { ICameraConfig } from "../../types";
import { onWindowResize } from "../../utils";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { IBrowserResizePlugin } from "./browser-resize-plugin.types";

export class BrowserResizePlugin {
    constructor(window: Window, element: Element | null = null) {
        return class implements IBrowserResizePlugin {
            private dataStore: IDataStore;

            public renderer: WebGLRenderer;
            public camera: PerspectiveCamera | OrthographicCamera;
            public cameraConfig: ICameraConfig;

            public listener: EventListener;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.renderer = this.dataStore.get(constants.store.renderer);
                this.camera = this.dataStore.get(constants.store.camera);
                this.cameraConfig = this.dataStore.get(constants.store.cameraConfig);

                this.listener = this.handleResize.bind(this) as EventListener;
            }

            public bindEventListener(): void {
                window.addEventListener("resize", this.listener);

                // Call once when binding to catch unregistered events
                this.handleResize();
            }

            public unbindEventListener(): void {
                window.removeEventListener("resize", this.listener);
            }

            public handleResize(e?: Event) {
                this.renderer = this.dataStore.get(constants.store.renderer);

                this.dataStore.set(constants.store.sizes, onWindowResize(element ? element : window, this.renderer, this.camera, this.cameraConfig.config))
            }
        }
    }
}

export default BrowserResizePlugin;
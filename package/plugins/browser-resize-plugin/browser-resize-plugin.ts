import { OrthographicCamera, PerspectiveCamera, WebGLRenderer } from "three";

import { ICameraConfig } from "../../types";
import { onWindowResize } from "../../utils";

import { IDataStore } from "../../data-store/data-store.types";

import { IBrowserResizePlugin } from "./browser-resize-plugin.types";

export class BrowserResizePlugin {
    constructor(window: Window, element: Element | null = null ) {
        return class implements IBrowserResizePlugin {
            private dataStore: IDataStore;

            public renderer: WebGLRenderer;
            public camera: PerspectiveCamera | OrthographicCamera;
            public cameraConfig: ICameraConfig;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.renderer = dataStore.get("renderer");
                this.camera = dataStore.get("camera");
                this.cameraConfig = dataStore.get("cameraConfig");
            }

            public bindEventListener(): void {
                window.addEventListener("resize", this.handleResize);
                
                this.setSize();
            }

            public unbindEventListener(): void {
                window.removeEventListener("resize", this.handleResize);
            }

            public handleResize(e: Event) {
                this.setSize();
            }

            public setSize() {
                this.dataStore.set("sizes", onWindowResize(element? element : window, this.renderer, this.camera, this.cameraConfig.config))
            }
        }
    }
}

export default BrowserResizePlugin;
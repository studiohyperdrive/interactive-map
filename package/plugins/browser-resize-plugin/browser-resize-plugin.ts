import { OrthographicCamera, PerspectiveCamera, WebGLRenderer } from "three";

import { ICameraConfig } from "../../types";
import { onWindowResize } from "../../utils";

import { IDataStore } from "../../data-store/data-store.types";

import { IBrowserResizePlugin } from "./browser-resize-plugin.types";

export class BrowserResizePlugin {
    constructor() {
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
                window.addEventListener("resize", e => this.handleResize(e));
            }

            public unbindEventListener(): void {
                window.removeEventListener("resize", e => this.handleResize(e));
            }

            public handleResize(e: UIEvent) {
                this.dataStore.set("sizes", onWindowResize(this.renderer, this.camera, this.cameraConfig.config));
            }
        }
    }
}
import { PerspectiveCamera, WebGLRenderer } from "three";
import { onWindowResize } from "../../utils";
import { IDataStore } from "../../data-store/data-store.types";
import { IBrowserResizePlugin } from "./browser-resize-plugin.types";

export default class BrowserResizePlugin {
    constructor() {
        return class implements IBrowserResizePlugin {
            private dataStore: IDataStore;

            public renderer: WebGLRenderer;
            public camera: PerspectiveCamera;
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.renderer = this.dataStore.get("renderer");
                this.camera = this.dataStore.get("camera");
            }

            public bindEventListener(): void {
                window.addEventListener("resize", e => this.handleResize(e));
            }

            public unbindEventListener(): void {
                window.removeEventListener("resize", e => this.handleResize(e));
            }

            public handleResize(e: UIEvent) {
                onWindowResize(this.renderer, this.camera);
            }
        }
    }
}
import { Camera, Scene, WebGLRenderer } from "three";
import { ISize } from "../../types";
import { IDataStore } from "../../data-store/data-store.types";
import { buildRenderer } from "../../utils";
import { IWebglRendererPlugin } from "./webgl-renderer-plugin.types";

export default class WebglRendererPlugin {
    constructor() {
        return class implements IWebglRendererPlugin{
            private dataStore: IDataStore;

            public canvas: HTMLCanvasElement;
            public sizes: ISize;
            public scene: Scene;
            public camera: Camera;
            public renderer: WebGLRenderer
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.canvas = dataStore.get("canvas");
                this.sizes = dataStore.get("sizes");
                this.scene = dataStore.get("scene");
                this.camera = dataStore.get("camera");
                this.renderer = buildRenderer(this.canvas, this.sizes);

                dataStore.set("renderer", this.renderer);
            }

            public update() {
                this.renderer.render(this.scene, this.camera);
            }
        }
    }
}
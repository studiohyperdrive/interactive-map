import { Camera, Scene, WebGLRenderer } from "three";

import { ISize, IWebglRendererConfig } from "../../types";
import { buildRenderer } from "../../utils";

import { IDataStore } from "../../data-store/data-store.types";

import { IWebglRendererPlugin } from "./webgl-renderer-plugin.types";

export default class WebglRendererPlugin {
    constructor(config?: IWebglRendererConfig) {
        return class implements IWebglRendererPlugin{
            private dataStore: IDataStore;

            public canvas: HTMLCanvasElement;
            public sizes: ISize;
            public scene: Scene;
            public camera: Camera;
            public renderer: WebGLRenderer

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.canvas = this.dataStore.get("canvas");
                this.sizes = this.dataStore.get("sizes");
                this.scene = this.dataStore.get("scene");
                this.camera = this.dataStore.get("camera");

                this.renderer = buildRenderer(this.canvas, this.sizes, config);

                this.dataStore.set("renderer", this.renderer);
            }

            public update() {
                this.renderer.render(this.scene, this.camera);
            }
        }
    }
}
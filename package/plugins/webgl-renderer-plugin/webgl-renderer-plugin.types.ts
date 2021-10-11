import { Camera, Scene, WebGLRenderer } from "three";

import { IScenePlugin, ISize } from "../../types";

export interface IWebglRendererPlugin extends IScenePlugin {
    canvas: HTMLCanvasElement,
    sizes: ISize,
    scene: Scene,
    camera: Camera,
    renderer: WebGLRenderer,
}
import { Camera, Scene, WebGLRenderer } from "three";

import { IScenePlugin, ISize, IWebglRendererConfig } from "../../types";

export interface IWebglRendererPlugin extends IScenePlugin {
    config: IWebglRendererConfig | undefined,
    canvas: HTMLCanvasElement,
    sizes: ISize,
    scene: Scene,
    camera: Camera,
    renderer: WebGLRenderer,
    setRenderer(canvas: HTMLCanvasElement, sizes: ISize, config?: IWebglRendererConfig): WebGLRenderer,
}
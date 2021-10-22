import ThreeEntryPoint from "../three-entry-point";

import { IMapControlsPlugin, IWebglRendererPlugin } from "../plugins";

import { getControlsPlugin, rebuildMapControlsPlugin } from "./manage-controls";
import { getRendererPlugin, rebuildRendererPlugin } from "./manage-renderer";

export const setNewCanvas = (three: ThreeEntryPoint, canvas: HTMLCanvasElement) => {
    const rendererPlugin: IWebglRendererPlugin | undefined = getRendererPlugin(three);
    if (rendererPlugin) {
        rebuildRendererPlugin(rendererPlugin, canvas, rendererPlugin.sizes, rendererPlugin.config);
    }

    // const controlsPlugin: IMapControlsPlugin | undefined = getControlsPlugin(three);
    // if (controlsPlugin) {
    //     rebuildMapControlsPlugin(controlsPlugin, controlsPlugin.camera, canvas);
    // }
}

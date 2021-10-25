import ThreeEntryPoint from "../three-entry-point";

import { IMapControlsPlugin, IWebglRendererPlugin } from "../plugins";

import { getControlsPlugin, rebuildMapControlsPlugin } from "./manage-controls";
import { getRendererPlugin, rebuildRendererPlugin } from "./manage-renderer";

/**
 * Helper function to replace the canvas instance on a ThreeEntryPoint instance.
 * 
 * ⚠️ **Note:** This function can not be used together with CameraLerpPlugin as it breaks smooth pann- & zooming.
 * 
 * @param three The current ThreeEntryPoint instance that should receive a new target canvas
 * @param canvas A reference to an existing canvas element
 */
export const setNewCanvas = (three: ThreeEntryPoint, canvas: HTMLCanvasElement) => {
    const rendererPlugin: IWebglRendererPlugin | undefined = getRendererPlugin(three);
    if (rendererPlugin) {
        rebuildRendererPlugin(rendererPlugin, canvas, rendererPlugin.sizes, rendererPlugin.config);
    }

    const controlsPlugin: IMapControlsPlugin | undefined = getControlsPlugin(three);
    if (controlsPlugin) {
        rebuildMapControlsPlugin(controlsPlugin, controlsPlugin.camera, canvas);
    }
}

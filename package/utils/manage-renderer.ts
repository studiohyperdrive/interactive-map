import ThreeEntryPoint from "../three-entry-point";

import { IWebglRendererPlugin } from "../plugins";
import { ISize, IWebglRendererConfig } from "../types";

export const getRendererPlugin = (three: ThreeEntryPoint): IWebglRendererPlugin | undefined => {
    return three.manager.plugins.find(plugin => {
        return plugin.renderer && plugin.sizes && plugin.setRenderer;
    });
}

export const rebuildRendererPlugin = (plugin: IWebglRendererPlugin, canvas: HTMLCanvasElement, sizes: ISize, config?: IWebglRendererConfig) => {
    plugin.renderer = plugin.setRenderer(canvas, sizes, config);
}


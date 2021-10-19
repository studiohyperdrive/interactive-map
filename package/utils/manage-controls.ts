import { Camera } from "three";

import ThreeEntryPoint from "../three-entry-point";

import { IMapControlsPlugin } from "../plugins";

export const getControlsPlugin = (three: ThreeEntryPoint): IMapControlsPlugin | undefined => {
    return three.manager.plugins.find(plugin => {
        return plugin.camera && plugin.canvas && plugin.createMapControls;
    });
}

export const rebuildMapControlsPlugin = (plugin: IMapControlsPlugin, camera: Camera, canvas: HTMLCanvasElement) => {
    plugin.mapControls = plugin.createMapControls(camera, canvas);
}

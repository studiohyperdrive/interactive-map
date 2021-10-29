import { ICameraLerpSynchroniserPlugin } from "./camera-lerp-synchroniser-plugin.types";

export const getCameraLerpSynchroniserPlugin = (plugins: any[]): ICameraLerpSynchroniserPlugin | undefined => {
    return plugins.find(plugin => isCameraLerpSynchroniserPlugin(plugin));
}

/**
 * Based on:
 * - https://stackoverflow.com/a/43922291
 * - https://stackoverflow.com/a/33733258
 * @param object The object to check
 * @returns boolean
 */
export const isCameraLerpSynchroniserPlugin = (object: any): object is ICameraLerpSynchroniserPlugin => {
    const properties = ['lerp', 'raycaster', 'hover', 'update'];
    return properties.every(prop => prop in object);
}
import { ICameraLerpPlugin } from "./camera-lerp-plugin.types";

export const getCameraLerpPlugin = (plugins: any[]): ICameraLerpPlugin | undefined => {
    return plugins.find(plugin => isCameraLerpPlugin(plugin));
}

/**
 * Based on:
 * - https://stackoverflow.com/a/43922291
 * - https://stackoverflow.com/a/33733258
 * @param object The object to check
 * @returns boolean
 */
export const isCameraLerpPlugin = (object: any): object is ICameraLerpPlugin => {
    const properties = ['camera', 'controls', 'isAnimating'];
    return properties.every(prop => prop in object);
}
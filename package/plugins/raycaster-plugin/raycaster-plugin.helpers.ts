import { IRaycasterPlugin } from "./raycaster-plugin.types";

export const getRaycasterPlugin = (plugins: any[]): IRaycasterPlugin | undefined => {
    return plugins.find(plugin => isRaycasterPlugin(plugin));
}

/**
 * Based on:
 * - https://stackoverflow.com/a/43922291
 * - https://stackoverflow.com/a/33733258
 * @param object The object to check
 * @returns boolean
 */
export const isRaycasterPlugin = (object: any): object is IRaycasterPlugin => {
    const properties = ['raycaster', 'camera', 'scene', 'handleCast'];
    return properties.every(prop => prop in object);
}
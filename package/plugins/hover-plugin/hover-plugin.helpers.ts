import { IHoverPlugin } from "./hover-plugin.types";

export const getHoverPlugin = (plugins: any[]): IHoverPlugin | undefined => {
    return plugins.find(plugin => isHoverPlugin(plugin));
}

/**
 * Based on:
 * - https://stackoverflow.com/a/43922291
 * - https://stackoverflow.com/a/33733258
 * @param object The object to check
 * @returns boolean
 */
export const isHoverPlugin = (object: any): object is IHoverPlugin => {
    const properties = ['animations', 'bindings', 'hovered', 'mixer', 'handleHover'];
    return properties.every(prop => prop in object);
}
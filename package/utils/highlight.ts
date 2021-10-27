import { MeshStandardMaterial, Object3D } from "three";

import { findParent } from "./gltf";

import { flattenChildren, getMeshes, setOpacity } from "./index";

export type highlightCallback = (selected: { name: string, object: Object3D }, others: string[]) => void;

/**
 * Function to define a list of objects that can be highlighted.
 * @param list A list of names that should dictate which objects are "highlight"-able. Note that the objects with these names should match exactly and are expected to be on the same hierarchical level.
 * @param object The mesh to start searching from. This object will be used as the origin from which to search for the first object that matches a name in the `list`-parameter.
 */
export const highlightOneOfList = (list: string[], object: Object3D, onHighlight: highlightCallback) => {
    const parents = list.map(key => findParent(object, { name: key, matching: 'exact' }));

    const clicked = parents.findIndex(parent => parent !== null);

    if (clicked >= 0) {
        const selected = parents[clicked] as Object3D;
        const others = list.filter(key => key !== list[clicked]);

        highlightOnSameLevel(selected, others);

        // Execute callback
        onHighlight({
            name: list[clicked],
            object: selected
        }, others);
    }
};

/**
 * Function to "highlight" a specific object and "dim" sibling objects by adjusting the `emissiveIntensity`.
 * @param highlight The object to **recursively** highlight.
 * @param dimmed The names of the other objects on the same level to **recursively** dim.
 */
export const highlightOnSameLevel = (highlight: { children: Object3D[], parent: Object3D | null }, dimmed: string[]) => {
    // Note: following functions disable recursivity to ensure a single setOpacity / mesh

    // Highlight the selected ones
    flattenChildren(highlight.children)
        .filter(hasMaterial)
        .forEach(child => {
            setOpacity(child, 1, false);
        });

    // Dim the others on the same level or un-dim them if they're all dimmed already
    if (highlight.parent !== null) {
        const dim = 0.3;
        const targets = flattenChildren(getMeshes(highlight.parent.children, dimmed), Infinity)
            .filter(hasMaterial);

        const shouldToggle = targets.every(item => {
            return ((item as { material: any }).material as MeshStandardMaterial)?.emissiveIntensity === dim;
        });

        targets.forEach(other => {
            setOpacity(other, shouldToggle ? 1 : dim, false);
        });
    }
};

const hasMaterial = (object: Object): boolean => {
    return object.hasOwnProperty('material');
};
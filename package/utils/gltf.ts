import { Mesh, Object3D, Scene } from "three";

import { IBindingConfig } from "../types";

import { isMatching } from "./bindings";

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#reduce_concat_isarray_recursivity
 */
export const flattenChildren = (array: Array<Object3D | Mesh>, d = 1): Array<Object3D | Mesh> => {
	return d > 0
		? array.reduce((acc, val) => acc.concat(Array.isArray(val.children)
			? flattenChildren(val.children, d - 1)
			: val), array)
		: array.slice();
};

export const getMeshes = (meshes: Object3D[], names: string[]): Array<Object3D | Mesh> => {
	return meshes.filter(mesh => names.includes(mesh.name));
};

export const getChildren = (scene: Scene, keys: string[], matching: "exact" | "partial"): Array<Object3D | Mesh> => {
	return flattenChildren(scene.children, Infinity).filter(child => {
		return keys.find(key => {
			return isMatching(child, {
				name: key,
				matching
			});
		});
	});
}

export const findParent = (mesh: { name: string, parent: Object3D | null }, binding: IBindingConfig): Object3D | null => {
	let parent = null;

	if (isMatching(mesh, binding)) parent = mesh as Object3D;
	else if (mesh.parent && mesh.parent.name) parent = findParent(mesh.parent, binding);

	return parent;
}
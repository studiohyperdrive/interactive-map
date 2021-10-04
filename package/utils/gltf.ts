import { Mesh, Object3D } from "three";

import { IBindingConfig } from "../types";

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

export const isMatching = (item: {name: string}, binding: IBindingConfig): boolean => {
	switch (binding.matching) {
		case "partial":
			return item.name.indexOf(binding.name) > -1;

		case "exact":
		default:
			return item.name === binding.name;
	}
}
/**
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#reduce_concat_isarray_recursivity
 */
export const flattenChildren = (array: Array<THREE.Object3D | THREE.Mesh>, d = 1): Array<THREE.Object3D | THREE.Mesh> => {
	return d > 0
		? array.reduce((acc, val) => acc.concat(Array.isArray(val.children)
			? flattenChildren(val.children, d - 1)
			: val), array)
		: array.slice();
};

export const getMeshes = (meshes: THREE.Object3D[], names: string[]): Array<THREE.Object3D | THREE.Mesh> => {
	return meshes.filter(mesh => names.includes(mesh.name));
};

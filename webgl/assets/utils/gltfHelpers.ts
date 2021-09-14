export const flattenChildren = (children: Array<THREE.Object3D | THREE.Mesh>, array: Array<THREE.Object3D | THREE.Mesh>): Array<THREE.Object3D | THREE.Mesh>  => {
	children.forEach(mesh => {
		array.push(mesh);
		flattenChildren(mesh.children, array);
	});

	return array;
};

export const getMeshes = (meshes: THREE.Object3D[], names: string[]): Array<THREE.Object3D | THREE.Mesh> => {
	return meshes.filter(mesh => names.includes(mesh.name));
};

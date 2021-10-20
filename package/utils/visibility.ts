import { Mesh, Object3D, Vector3 } from "three";

export const OOO = new Vector3(0, 0, 0);

export const hideChild = (child: Object3D | Mesh): Object3D | Mesh => {
    return showChild(child, OOO);
}

export const showChild = (child: Object3D | Mesh, size: Vector3): Object3D | Mesh => {
    const { x, y, z } = size;
    child.scale.set(x, y, z);
    return child;
}
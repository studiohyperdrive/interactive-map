import { Mesh, Object3D, Vector3 } from "three";

export const OOO = new Vector3(0, 0, 0);

export const hideChild = (child: Object3D | Mesh): Object3D | Mesh => {
    child.visible = false;
    return child;
}

export const showChild = (child: Object3D | Mesh): Object3D | Mesh => {
    child.visible = true
    return child;
}
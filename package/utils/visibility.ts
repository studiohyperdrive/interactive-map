import { Mesh, Object3D, Vector3 } from "three";

export const OOO = new Vector3(0, 0, 0);

export const hideChild = (child: Object3D | Mesh): Object3D | Mesh => {
    child.visible = false;
    child.children.forEach(sub => hideChild(sub));
    return child;
}

export const showChild = (child: Object3D | Mesh): Object3D | Mesh => {
    child.visible = true
    child.children.forEach(sub => showChild(sub));
    return child;
}
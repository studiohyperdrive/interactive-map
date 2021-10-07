import { Mesh, MeshStandardMaterial } from "three";

export const mutatePlainColor = (mesh: Mesh): void => {
    const material = (mesh.material as MeshStandardMaterial).clone();
    material.color.setHex(0xcbcbcb);
    mesh.material = material;
};

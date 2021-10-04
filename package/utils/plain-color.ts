import { Mesh, MeshStandardMaterial } from "three";

export const mutatePlainColor = (mesh: Mesh): void => {
    const material = (mesh.material as MeshStandardMaterial).clone();    
    material.color.setHex(Math.random() * 0xffffff);
    mesh.material = material;
};

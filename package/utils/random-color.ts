import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from "three";

export const mutateRandomColor = (mesh: Mesh): void => {
    mesh.material = new MeshPhysicalMaterial({ color: Math.random() * 0xffffff });
    const material = (mesh.material as MeshStandardMaterial).clone();    
    material.color.setHex(Math.random() * 0xffffff);
    mesh.material = material;
};
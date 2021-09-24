import { Mesh, MeshPhysicalMaterial } from "three";

export const mutateRandomColor = (mesh: Mesh): void => {
    mesh.material = new MeshPhysicalMaterial({ color: Math.random() * 0xffffff });
};
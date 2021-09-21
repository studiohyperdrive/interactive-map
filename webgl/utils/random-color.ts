import { Mesh, MeshPhysicalMaterial } from "three";

export default function mutateRandomColor(mesh: Mesh): void {
    mesh.material = new MeshPhysicalMaterial({ color: Math.random() * 0xffffff });
};
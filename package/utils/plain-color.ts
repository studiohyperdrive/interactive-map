import { Mesh, MeshPhysicalMaterial } from "three";

export const mutatePlainColor = (mesh: Mesh): void => {
    const plain = new MeshPhysicalMaterial({ 
        color: 0xE7E7E7,
        metalness: 0.173,
        specularIntensity: 0.5,
        roughness: 0.5,
        clearcoatRoughness: 0.03,
    });

    mesh.material = plain;
};
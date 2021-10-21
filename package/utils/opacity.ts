import { MeshStandardMaterial } from "three";

export const setOpacity = (obj: any, opacity: number, recursive = true) => {
    if (obj.material && obj.type !== "Group") {
        const material = (obj.material as MeshStandardMaterial).clone();

        material.emissiveIntensity = opacity;

        return obj.material = material;
    }

    if (recursive) {
        obj.children && obj.children.forEach((child: any) => {
            setOpacity(child, opacity);
        });
    }
};
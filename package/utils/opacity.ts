import { MeshStandardMaterial } from "three";

export const setOpacity = (obj: any, opacity: number) => {
  if (obj.material && obj.type !== "Group") {
    const material = (obj.material as MeshStandardMaterial).clone();
    material.emissiveIntensity = opacity;
    return obj.material = material;
  }

  obj.children && obj.children.forEach((child: any) => {
    return setOpacity(child, opacity);
  })
};
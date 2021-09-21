import { Mesh, MeshStandardMaterial } from "three";
import { IClickBindingConfig } from "../webgl/types";

export default ([
    {
        name: 'skyscraper',
        matching: 'partial',
        onClick: (mesh: Mesh) => {
            const material = (mesh.material as MeshStandardMaterial).clone();
            material.color.setHex(Math.random() * 0xffffff);

            mesh.material = material;
        }
    }
] as IClickBindingConfig[]);
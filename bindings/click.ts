import { Mesh, MeshStandardMaterial, LoopOnce } from "three";
import { IClickBindingConfig } from "../webgl/types";

export default ([
    {
        name: 'skyscraper',
        matching: 'partial',
        onClick: (mesh: Mesh) => {
            const material = (mesh.material as MeshStandardMaterial).clone();
            material.color.setHex(Math.random() * 0xffffff);

            mesh.material = material;
        },
    },
    {
        name: 'small-house',
        matching: 'exact',
        onClick: (mesh: Mesh) => {
            const material = (mesh.material as MeshStandardMaterial).clone();
            material.color.setHex(Math.random() * 0xffffff);

            mesh.material = material;
        },
        animate: [
            {
                name: 'small-houseAction',
                matching: 'exact',
                loop: LoopOnce,
            }
        ]
    }
] as IClickBindingConfig[]);

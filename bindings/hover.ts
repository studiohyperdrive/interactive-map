import { Mesh, MeshPhysicalMaterial } from "three";
import { IHoverBindingConfig } from "../webgl/types";

export default ([
    {
        name: 'skyscraper',
        matching: 'partial',
        onHoverStart: (mesh: Mesh) => {
            const random = new MeshPhysicalMaterial({ color: Math.random() * 0xffffff });
            mesh.material = random;
        },
        onHoverEnd: (mesh: Mesh) => {
            const random = new MeshPhysicalMaterial({ 
                color: 0xE7E7E7,
                metalness: 0.173,
                specularIntensity: 0.5,
                roughness: 0.5,
                clearcoatRoughness: 0.03,
            });
            mesh.material = random;
        },
    },
    {
        name: 'small-house',
        matching: 'partial',
        onHoverStart: (mesh: Mesh) => {
            const random = new MeshPhysicalMaterial({ color: Math.random() * 0xffffff });
            mesh.material = random;
        },
        onHoverEnd: (mesh: Mesh) => {
            const random = new MeshPhysicalMaterial({ 
                color: 0xE7E7E7,
                metalness: 0.173,
                specularIntensity: 0.5,
                roughness: 0.5,
                clearcoatRoughness: 0.03,
            });
            mesh.material = random;
        },
    }
] as IHoverBindingConfig[]);
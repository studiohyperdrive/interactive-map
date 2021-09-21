import { LoopRepeat, Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import { IHoverBindingConfig } from "../webgl/types";

export default ([
    {
        name: 'skyscraper',
        matching: 'partial',
        onHoverStart: (mesh: Mesh) => {
            const material = (mesh.material as MeshStandardMaterial).clone();
            material.color.setHex(Math.random() * 0xffffff);

            mesh.material = material;
        },
        onHoverEnd: (mesh: Mesh) => {
            const material = (mesh.material as MeshStandardMaterial).clone();
            material.color.setRGB(0.7991031408309937, 0.7991029024124146, 0.7991030216217041);

            mesh.material = material;
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
    },
    {
        name: 'tower',
        matching: 'exact',
        onHoverStart: () => {},
        onHoverEnd: () => {},
        animate: [
            {
                name: 'penthouseAction',
                matching: 'partial',
                loop: LoopRepeat,
            },
        ]
    },
    {
        name: 'ring',
        matching: 'partial',
        onHoverStart: () => {},
        onHoverEnd: () => {},
        animate: [
            {
                name: 'roofAction',
                matching: 'exact',
                loop: LoopRepeat,
            },
            
            {
                name: 'ringAction.001',
                matching: 'exact',
                loop: LoopRepeat,
            },
        ]
    },
] as IHoverBindingConfig[]);
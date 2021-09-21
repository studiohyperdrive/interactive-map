import { Mesh, MeshPhysicalMaterial } from "three";
import { IHoverBindingConfig } from "../webgl/types";
import mutateRandomColor from "../webgl/utils/random-color";

const mutatePlainColor = (mesh: Mesh) => {
    const plain = new MeshPhysicalMaterial({ 
        color: 0xE7E7E7,
        metalness: 0.173,
        specularIntensity: 0.5,
        roughness: 0.5,
        clearcoatRoughness: 0.03,
    });

    mesh.material = plain;
};

export default ([
    {
        name: 'skyscraper',
        matching: 'partial',
        onHoverStart: mutateRandomColor,
        onHoverEnd: mutatePlainColor
    },
    {
        name: 'small-house',
        matching: 'partial',
        onHoverStart: mutateRandomColor,
        onHoverEnd: mutatePlainColor
    }
] as IHoverBindingConfig[]);
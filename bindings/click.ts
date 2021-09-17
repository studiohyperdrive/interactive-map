import { Mesh, MeshPhysicalMaterial } from "three";
import { IClickBindingConfig } from "../webgl/types";

export default ([
    {
        name: 'skyscraper',
        matching: 'partial',
        onClick: (mesh: Mesh) => {
            const random = new MeshPhysicalMaterial();
            random.color.setHex(Math.random() * 0xffffff);

            mesh.material = random;
        }
    }
] as IClickBindingConfig[]);
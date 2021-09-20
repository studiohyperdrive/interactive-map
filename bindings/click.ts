import { NextRouter } from "next/dist/client/router";
import { Mesh, MeshPhysicalMaterial } from "three";
import { IClickBindingConfig } from "../webgl/types";

export default function createClickBindings(router: NextRouter) {
    return ([
        {
            name: "skyscraper",
            matching: "partial",
            onClick: (mesh: Mesh) => {
                const random = new MeshPhysicalMaterial();
                random.color.setHex(Math.random() * 0xffffff);
    
                mesh.material = random;
            }
        },
        {
            name: "tower",
            matching: "partial",
            onClick: (mesh: Mesh) => {
                const random = new MeshPhysicalMaterial();
                random.color.setHex(Math.random() * 0xffffff);
    
                mesh.material = random;

                router.push("/tower");
            }
        }
    ] as IClickBindingConfig[]);
}
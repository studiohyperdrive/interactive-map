import { Mesh } from "three";
import { Store } from "redux";
import { NextRouter } from "next/dist/client/router";

import { IClickBindingConfig } from "@shd-developer/interactive-map/dist/types";

import { handleOpacity } from "./helpers";

const barns = [
    "livestock-farm",
    "agriculture",
    "dairy-farm",
    "horticulture"
]

export default function createClickBindings(store: Store, router: NextRouter) {
    return ([
        {
            name: "farm",
            matching: "partial",
            onClick: (mesh: Mesh) => handleOpacity(mesh, store)
        },
        /* {
            name: "lake",
            matching: "partial",
            onClick: (mesh: Mesh) => handleOpacity(mesh, store)
        }, */
        /* {
            name: "tower",
            matching: "partial",
            onClick: (mesh: Mesh) => {
                mutateRandomColor(mesh);
                router.push("/tower");
            }
        },
        {
            name: "ring",
            matching: "exact",
            onClick: (mesh: Mesh) => {
                store.dispatch({ type: actions.dialogs.ring.open });
                store.dispatch({ type: actions.tooltip.reset });
            }
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
        } */
    ] as IClickBindingConfig[]);
}

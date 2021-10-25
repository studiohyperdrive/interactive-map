import { Mesh } from "three";
import { Store } from "redux";
import { NextRouter } from "next/dist/client/router";

import { IClickBindingConfig } from "@studiohyperdrive/interactive-map/dist/types";
import { mutateRandomColor, highlightOneOfList } from "@studiohyperdrive/interactive-map/dist/utils";

import actions from "../redux/actions";

export default function createClickBindings(store: Store, router: NextRouter) {
    return ([
        {
            name: "",
            matching: "partial",
            onClick: (mesh: Mesh) => {
                const keys = ['dairy-farm', 'agriculture-farm', 'horticulture-farm', 'livestock-farm'];
                highlightOneOfList(keys, mesh);
            }
        },
        // {
        //     name: "lake",
        //     matching: "partial",
        //     onClick: (mesh: Mesh) => handleOpacity(mesh, store)
        // },
        {
            name: "skyscraper",
            matching: "partial",
            onClick: (mesh: Mesh) => {
                mutateRandomColor(mesh);
                store.dispatch({ type: actions.three.disable });
                router.push("/tower");
            }
        },
        // {
        //     name: "ring",
        //     matching: "exact",
        //     onClick: (mesh: Mesh) => {
        //         store.dispatch({ type: actions.three.disable });
        //         store.dispatch({ type: actions.dialogs.ring.open });
        //         store.dispatch({ type: actions.tooltip.reset });
        //     }
        // },
        // {
        //     name: 'small-house',
        //     matching: 'exact',
        //     onClick: (mesh: Mesh) => {
        //         const material = (mesh.material as MeshStandardMaterial).clone();
        //         material.color.setHex(Math.random() * 0xffffff);

        //         mesh.material = material;
        //     },
        //     animate: [
        //         {
        //             name: 'small-houseAction',
        //             matching: 'exact',
        //             loop: LoopOnce,
        //         }
        //     ]
        // }
    ] as IClickBindingConfig[]);
}

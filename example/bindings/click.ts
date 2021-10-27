import { Mesh, Object3D } from "three";
import { Store } from "redux";
import { NextRouter } from "next/dist/client/router";

import { IDataStore } from "@studiohyperdrive/interactive-map/dist/data-store/data-store.types";
import { IClickBindingConfig } from "@studiohyperdrive/interactive-map/dist/plugins";
import { mutateRandomColor, highlightOneOfList } from "@studiohyperdrive/interactive-map/dist/utils";

import actions from "../redux/actions";

export function createClickBindings(store: Store, router: NextRouter) {
    return ([
        {
            name: "",
            matching: "partial",
            onClick: (object: Mesh | Object3D, datastore: IDataStore) => {
                const keys = ['dairy-farm', 'agriculture-farm', 'horticulture-farm', 'livestock-farm'];
                highlightOneOfList(keys, object);
            }
        },
        // {
        //     name: "lake",
        //     matching: "partial",
        //     onClick: (object: Mesh | Object3D, datastore: IDataStore) => handleOpacity(mesh, store)
        // },
        {
            name: "skyscraper",
            matching: "partial",
            onClick: (object: Mesh | Object3D, datastore: IDataStore) => {
                if (object instanceof Mesh) {
                    mutateRandomColor(object);
                }

                store.dispatch({ type: actions.three.disable });
                router.push("/tower");
            }
        },
        // {
        //     name: "ring",
        //     matching: "exact",
        //     onClick: (object: Mesh | Object3D, datastore: IDataStore) => {
        //         store.dispatch({ type: actions.three.disable });
        //         store.dispatch({ type: actions.dialogs.ring.open });
        //         store.dispatch({ type: actions.tooltip.reset });
        //     }
        // },
        // {
        //     name: 'small-house',
        //     matching: 'exact',
        //     onClick: (object: Mesh | Object3D, datastore: IDataStore) => {
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

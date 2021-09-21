import { NextRouter } from "next/dist/client/router";
import { Store } from "redux";

import { Mesh } from "three";

import actions from "../redux/actions";

import { IClickBindingConfig } from "../webgl/types";
import mutateRandomColor from "../webgl/utils/random-color";

export default function createClickBindings(store: Store, router: NextRouter) {
    return ([
        {
            name: "skyscraper",
            matching: "partial",
            onClick: mutateRandomColor
        },
        {
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
            }
        }
    ] as IClickBindingConfig[]);
}
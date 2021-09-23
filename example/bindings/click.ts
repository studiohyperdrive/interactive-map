import { IClickBindingConfig } from "@shd-developer/interactive-map/dist/types";
import mutateRandomColor from "@shd-developer/interactive-map/dist/utils/random-color";
import { NextRouter } from "next/dist/client/router";
import { Store } from "redux";

import { Mesh } from "three";

import actions from "../redux/actions";

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
                store.dispatch({ type: actions.tooltip.reset });
            }
        }
    ] as IClickBindingConfig[]);
}
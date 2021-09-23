import { IHoverBindingConfig } from "@shd-developer/interactive-map";
import mutateRandomColor from "@shd-developer/interactive-map/dist/utils/random-color";
import mutatePlainColor from "@shd-developer/interactive-map/dist/utils/plain-color";
import { Store } from "redux";

import actions from "../redux/actions";
import { Mesh } from "three";

export default function createHoverBindings(store: Store) {
    return ([
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
        },
        {
            name: "", // apply to everything
            matching: "partial",
            onHoverStart: (mesh: Mesh) => {
                store.dispatch({
                    type: actions.tooltip.set,
                    payload: mesh.name
                });
            },
            onHoverEnd: (mesh: Mesh) => {
                store.dispatch({
                    type: actions.tooltip.reset
                });
            }
        }
    ] as IHoverBindingConfig[]);
}
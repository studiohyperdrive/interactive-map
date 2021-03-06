import { Store } from "redux";
import { LoopRepeat, Mesh } from "three";

import { IHoverBindingConfig } from "@studiohyperdrive/interactive-map/dist/plugins";
import { mutatePlainColor, mutateRandomColor } from "@studiohyperdrive/interactive-map/dist/utils";

import actions from "../redux/actions";

export function createHoverBindings(store: Store) {
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
            name: 'tower',
            matching: 'exact',
            onHoverStart: () => { },
            onHoverEnd: () => { },
            animate: [
                {
                    name: 'penthouseAction',
                    matching: 'partial',
                    loop: LoopRepeat,
                },
            ],
        },
        {
            name: 'ring',
            matching: 'partial',
            onHoverStart: () => { },
            onHoverEnd: () => { },
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

import { Store } from "redux";

import { Mesh, MeshPhysicalMaterial } from "three";

import actions from "../redux/actions";

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
                })
            }
        }
    ] as IHoverBindingConfig[]);
}
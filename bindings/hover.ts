import { Store } from "redux";

import { LoopRepeat, Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from "three";

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
            name: 'tower',
            matching: 'exact',
            onHoverStart: () => {},
            onHoverEnd: () => {},
            animate: [
                {
                    name: 'penthouseAction',
                    matching: 'partial',
                    loop: LoopRepeat,
                },
            ]
        },
        {
            name: 'ring',
            matching: 'partial',
            onHoverStart: () => {},
            onHoverEnd: () => {},
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

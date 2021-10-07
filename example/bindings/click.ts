import { Mesh } from "three";
import { flattenChildren } from "@shd-developer/interactive-map";
import { IClickBindingConfig } from "@shd-developer/interactive-map/dist/types";
import { setOpacity } from "@shd-developer/interactive-map/dist/utils/opacity";
import { NextRouter } from "next/dist/client/router";
import { Store } from "redux";

const barns = [
    "livestock-farm",
    "agriculture",
    "dairy-farm",
    "horticulture"
]

export default function createClickBindings(store: Store, router: NextRouter) {
    const handleOpacity = (mesh: Mesh) => {
        const parent = mesh.parent ? mesh.parent.parent ? mesh.parent.parent : mesh.parent : null;
        const { three } = store.getState();
        const scene = three.manager.scene;

        const children = flattenChildren(scene.children, Infinity);

        parent && children.forEach((c) => {
            if (c.parent && c.parent.name !== parent.name && c.parent.parent && c.parent.parent.name !== parent.name) {
                setOpacity(c, 0.3);
            } else {
                setOpacity(parent, 1);
            }
        });
    }

    return ([
        {
            name: "farm",
            matching: "partial",
            onClick: handleOpacity
        },
        /* {
            name: "lake",
            matching: "partial",
            onClick: handleOpacity
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

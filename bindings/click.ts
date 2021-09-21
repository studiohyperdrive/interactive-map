import { NextRouter } from "next/dist/client/router";

import { Mesh } from "three";

import { IClickBindingConfig } from "../webgl/types";
import mutateRandomColor from "../webgl/utils/random-color";

export default function createClickBindings(router: NextRouter) {
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
        }
    ] as IClickBindingConfig[]);
}
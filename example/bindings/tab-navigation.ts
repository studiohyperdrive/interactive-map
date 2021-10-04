import { Mesh, Object3D } from "three";

import { ITabNavigationBinding } from "@shd-developer/interactive-map/dist/plugins";
import { mutateRandomColor } from "@shd-developer/interactive-map";

export default function createTabNavigationBindings(): ITabNavigationBinding[] {
    return [
        {
            name: "small-house",
            matching: "exact",
            order: 0,
            afterNavigate: (child: Object3D | Mesh) => {
                console.info('first');
                mutateRandomColor((child as Mesh));
            }
        },
        {
            name: "small-house012",
            matching: "exact",
            order: 2,
            afterNavigate: (child: Object3D | Mesh) => {
                console.info('last');
                mutateRandomColor((child as Mesh));
            }
        },
        {
            name: "skyscraper002",
            matching: "exact",
            order: 1,
            afterNavigate: (child: Object3D | Mesh) => {
                console.info('second');
                mutateRandomColor((child as Mesh));
            }
        }
    ];
}
import { Mesh, Object3D } from "three";

import { IDataStore } from "@studiohyperdrive/interactive-map/dist/data-store/data-store.types";
import { ITabNavigationBindingConfig } from "@studiohyperdrive/interactive-map/dist/plugins";
import { zoomCameraToSelection, mutateRandomColor, zoomCameraToConfig } from "@studiohyperdrive/interactive-map/dist/utils";

import { ortho, ortho2 } from "../config/sceneConfig";
import { BindingCallback } from "@studiohyperdrive/interactive-map/dist/types";

export const zoomAndColor: BindingCallback = (
    object: Object3D | null,
    datastore: IDataStore
) => {
    const objects = object ? [object] : [];

    zoomCameraToSelection(objects, datastore, 3);

    objects.forEach(object => {
        mutateRandomColor((object as Mesh));
    });
};

export const resetCamera: BindingCallback = (
    object: Object3D | null,
    datastore: IDataStore
) => {
    zoomCameraToConfig(datastore, ortho2.camera.config);
}

export function createTabNavigationBindings(): ITabNavigationBindingConfig[] {
    return [
        {
            name: "small-house",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        {
            name: "small-house001",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        {
            name: "small-house002",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        // {
        //     name: "small-house003",
        //     matching: "exact",
        //     order: 0,
        //     afterNavigate: zoomAndColor
        // },
        {
            name: "small-house004",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        {
            name: "small-house005",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        {
            name: "small-house006",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        {
            name: "small-house007",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        {
            name: "small-house008",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        {
            name: "small-house009",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        {
            name: "small-house010",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        {
            name: "small-house011",
            matching: "exact",
            order: 0,
            afterNavigate: zoomAndColor
        },
        {
            name: "small-house012",
            matching: "exact",
            order: 2,
            afterNavigate: zoomAndColor
        }
    ];
}
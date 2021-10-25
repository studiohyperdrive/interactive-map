import { Mesh, Object3D, OrthographicCamera, PerspectiveCamera, Sphere, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import { ITabNavigationBinding } from "@studiohyperdrive/interactive-map/dist/plugins";
import { zoomCameraToSelection, mutateRandomColor, setCameraToConfig } from "@studiohyperdrive/interactive-map/dist/utils";

import { ortho, ortho2 } from "../config/sceneConfig";

const zoomAndColor = (
    camera: PerspectiveCamera | OrthographicCamera,
    controls: MapControls,
    children: Array<Object3D | Mesh>,
    setZoomProps: (props: any) => void,
    setBoundingSphere: (sphere: Sphere) => void
) => {
    zoomCameraToSelection(camera, controls, children, setZoomProps, 3);

    children.forEach(child => {
        mutateRandomColor((child as Mesh));
    });
}

export default function createTabNavigationBindings(): ITabNavigationBinding[] {
    return [
        {
            name: "base",
            matching: "exact",
            order: 0,
            afterNavigate: (
                camera: PerspectiveCamera | OrthographicCamera,
                controls: MapControls,
                children: Array<Object3D | Mesh>,
                setZoomProps: (props: any) => void,
                setBoundingSphere: (sphere: Sphere) => void
            ) => {
                setCameraToConfig(camera, controls, ortho2.camera.config, setZoomProps);
            }
        },
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
        },
        {
            name: "base",
            matching: "exact",
            order: 9999,
            afterNavigate: (
                camera: PerspectiveCamera | OrthographicCamera,
                controls: MapControls,
                children: Array<Object3D | Mesh>,
                setZoomProps: (props: any) => void,
                setBoundingSphere: (sphere: Sphere) => void
            ) => {
                setCameraToConfig(camera, controls, ortho2.camera.config, setZoomProps);
            }
        }
    ];
}
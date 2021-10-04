import { MOUSE, TOUCH, Vector3 } from "three";
import { IMapControlsConfig } from "@shd-developer/interactive-map/dist/plugins/map-controls-plugin/map-controls-plugin.types";

export default {
    enableDamping: true,
    dampingFactor: 0.1,
    rotateSpeed: 0.3,
    panSpeed: 0.5,
    zoomSpeed: 0.3,
    mouseButtons: {
        LEFT: MOUSE.ROTATE,
        MIDDLE: MOUSE.DOLLY,
        RIGHT: MOUSE.PAN
    },
    touches: {
        ONE: TOUCH.ROTATE,
        TWO: TOUCH.DOLLY_PAN
    },
    rotationLimits: {
        minPolarAngle: 0.9553166181245092,
        maxPolarAngle: 0.9553166181245092,
        minAzimuthAngle: 0,
        maxAzimuthAngle: Math.PI / 2,
    },
    panLimits: {
        minPan: new Vector3(-1, 0, -2),
        maxPan: new Vector3(1, 0, 0),
    },
    zoomLimits: {
        minZoom: 0.8,
        maxZoom: 2,
    }
} as IMapControlsConfig;

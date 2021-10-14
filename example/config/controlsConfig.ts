import { MOUSE, TOUCH, Vector3 } from "three";
import { IMapControlsConfig } from "@studiohyperdrive/interactive-map/dist/plugins";

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
        minAzimuthAngle: Math.PI / 6,
        maxAzimuthAngle: Math.PI / 3,
    },
    panLimits: {
        minPan: new Vector3(0, 0, 0),
        maxPan: new Vector3(0, 0, 0),
    },
    zoomLimits: {
        minZoom: 1,
        maxZoom: 2,
    }
} as IMapControlsConfig;

import { MOUSE, TOUCH, Vector3 } from 'three';

import { ISceneConfig } from '@shd-developer/interactive-map';

export default {
    camera: {
        type: 'orthographic',
        config: {
            frustumSize: 2,
            near: 0.0001,
            far: 5,
            position:
            {
                x: 2,
                y: 2,
                z: 2
            }
        }
    },
    controls: {
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
    }
} as ISceneConfig;
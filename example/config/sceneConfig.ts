import { ISceneConfig } from "@shd-developer/interactive-map/dist/types";
import { AmbientLight, DirectionalLight, sRGBEncoding, Vector3 } from "three";

export const ortho: ISceneConfig = {
    camera: {
        type: "orthographic",
        config: {
            frustumSize: 1400,
            near: 1,
            far: 10000,
            position: {
                x: 1500,
                y: -1500,
                z: 1500
            }
        }
    },
    map: '',
    controls: {},
    illuminationConfig: {
        /*         lights: [
                    {
                        setup: new AmbientLight(0xffffff, 1),
                    },
                    {
                        setup: new DirectionalLight(0xffffff, 1),
                        position: new Vector3(1, 1, 1),
                    }
                ], */
        outputEncoding: sRGBEncoding,
    },

} as ISceneConfig;

export const perspective: ISceneConfig = {
    camera: {
        type: "perspective",
        config: {
            fov: 75,
            near: 0.1,
            far: 5,
            position: {
                x: 2,
                y: 2,
                z: 2
            },
        }
    },
    map: '',
    controls: {},
    illuminationConfig: {
        lights: [
            {
                setup: new AmbientLight(0xffffff, 1),
            },
            {
                setup: new DirectionalLight(0xffffff, 1),
                position: new Vector3(1, 1, 1),
            }
        ],
        outputEncoding: sRGBEncoding,
    },
}

import { ISceneConfig } from "@shd-developer/interactive-map/dist/types";
import { sRGBEncoding } from "three";

export default {
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
    illuminationConfig: {
        /* lights: [
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
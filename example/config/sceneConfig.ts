import { ISceneConfig } from "@shd-developer/interactive-map/dist/types";

export default {
    camera: {
        type: "orthographic",
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
} as ISceneConfig;
import { ISceneConfig } from "@studiohyperdrive/interactive-map/dist/types";

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
    }
};

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
    }
};

import { IPosition, ISceneConfig } from "@studiohyperdrive/interactive-map/dist/types";

const far: IPosition = {
    x: 1500,
    y: -1500,
    z: 1500
};

const near: IPosition = {
    x: 3,
    y: 3,
    z: 3
};

export const ortho: ISceneConfig = {
    camera: {
        type: "orthographic",
        config: {
            frustumSize: 1400,
            near: 0.1,
            far: 10000,
            position: far
        }
    }
};

export const ortho2: ISceneConfig = {
    camera: {
        type: "orthographic",
        config: {
            frustumSize: 5,
            near: 0.1,
            far: 10,
            position: near
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
            position: near
        }
    }
};

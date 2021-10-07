import { ISceneConfig } from "@shd-developer/interactive-map/dist/types";

export const ortho: ISceneConfig = {
    camera: {
        type: "orthographic",
        config: {
            frustumSize: 2,
            near: 0.0001,
            far: 100,
            position: {
                x: 2,
                y: 2,
                z: 2
            }
        }
    },
    map: '',
    controls: {}
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
    },
    map: '',
    controls: {}
}

export default ortho as ISceneConfig;
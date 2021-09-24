import { ISceneConfig } from "@shd-developer/interactive-map";

export default {
    map: "/models/interactive-map_v2.8-draco.glb",
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
    }
} as ISceneConfig;
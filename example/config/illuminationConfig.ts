// import { AmbientLight, DirectionalLight, Vector3 } from "three";
import { IIlluminationConfig } from "@studiohyperdrive/interactive-map/dist/types";

export const config = {
    lights: [
        // {
        //     setup: new AmbientLight(0xffffff, 1),
        // },
        // {
        //     setup: new DirectionalLight(0xffffff, 1),
        //     position: new Vector3(1, 1, 1),
        // }
    ],
} as IIlluminationConfig;

export default config;
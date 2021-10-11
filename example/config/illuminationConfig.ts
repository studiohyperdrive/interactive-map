import { AmbientLight, DirectionalLight, sRGBEncoding, Vector3 } from "three";
import { IIlluminationConfig } from "@shd-developer/interactive-map";

export const config = {
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
} as IIlluminationConfig;

export default config;
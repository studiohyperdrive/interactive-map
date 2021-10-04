import { Camera } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";
import { IScenePlugin } from "../../types";

export interface IMapControlsPlugin extends IScenePlugin {
    camera: Camera;
    canvas: HTMLCanvasElement,
    createMapControls: (camera: Camera, canvas: HTMLCanvasElement) => MapControls,
}
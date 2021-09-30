import { Raycaster } from "three";
import { IScenePlugin, ISceneProps } from "../../types";

export interface IRacasterPlugin extends IScenePlugin {
    sceneProps: ISceneProps,
    raycaster: Raycaster,
    handleClick: () => void,
}
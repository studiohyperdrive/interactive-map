import { ISceneProps } from "../../types";
import { IScenePlugin } from "../../types";

export interface IMousePositionPlugin extends IScenePlugin {
    sceneProps: ISceneProps,
    handleMouseMove: (e: MouseEvent) => void,
}
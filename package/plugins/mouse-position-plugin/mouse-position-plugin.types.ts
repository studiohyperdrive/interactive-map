import { IScenePlugin } from "../../types";

export interface IMousePositionPlugin extends IScenePlugin {
    handleMouseMove: (e: MouseEvent) => void,
}
import { IEventPlugin } from "../../types";

export interface IMousePositionPlugin extends IEventPlugin {
    handleMouseMove: (e: MouseEvent) => void,
    clearMousePosition: () => void,
}
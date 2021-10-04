import { PerspectiveCamera, WebGLRenderer } from "three";
import { IEventPlugin } from "../../types";

export interface IBrowserResizePlugin extends IEventPlugin {
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    bindEventListener: () => void,
    unbindEventListener: () => void,
    handleResize: (e:UIEvent) => void,
}
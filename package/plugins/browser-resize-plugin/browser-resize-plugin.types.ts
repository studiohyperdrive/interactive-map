import { OrthographicCamera, PerspectiveCamera, WebGLRenderer } from "three";

import { IEventPlugin } from "../../types";

export interface IBrowserResizePlugin extends IEventPlugin {
    renderer: WebGLRenderer,
    camera: PerspectiveCamera | OrthographicCamera,
    handleResize: (e:UIEvent) => void,
}
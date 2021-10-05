import { AnimationMixer, Clock, OrthographicCamera, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer } from "three";

import { ISize, IOrthographicCameraConfig, IPerspectiveCameraConfig, IIlluminationConfig } from "../types";

import { calculateCursorX, calculateCursorY } from "./general";

export const buildScene = (): Scene => {
    return new Scene();
};

export const buildRenderer = (canvas: HTMLCanvasElement, sizes: ISize, illuminationConfig?: IIlluminationConfig): WebGLRenderer => {
    const renderer: WebGLRenderer = new WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (illuminationConfig && illuminationConfig.outputEncoding) {
        renderer.outputEncoding = illuminationConfig.outputEncoding;
    }

    return renderer;
};

export const buildPerspectiveCamera = (scene: Scene, sizes: ISize, config: IPerspectiveCameraConfig): PerspectiveCamera => {
    const camera: PerspectiveCamera = new PerspectiveCamera(config.fov, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(config.position.x, config.position.y, config.position.z);
    camera.lookAt(new Vector3);
    scene.add(camera);

    return camera;
};

export const buildOrthographicCamera = (scene: Scene, sizes: ISize, config: IOrthographicCameraConfig): OrthographicCamera => {
    const aspectRatio = sizes.width / sizes.height
    const camera: OrthographicCamera = new OrthographicCamera(config.frustumSize * aspectRatio / - 2, config.frustumSize * aspectRatio / 2, config.frustumSize / 2, config.frustumSize / - 2, config.near, config.far);
    camera.position.set(config.position.x, config.position.y, config.position.z);
    camera.lookAt(new Vector3);
    scene.add(camera);

    return camera;
};

export const buildClock = (): Clock => {
    return new Clock();
};

export const buildMouse = (e: MouseEvent): Vector2 => {
    const mouse = new Vector2();

    mouse.x = calculateCursorX(e);
    mouse.y = calculateCursorY(e);

    return mouse;
}

export const buildRaycaster = (): Raycaster => {
    return new Raycaster();
}

export const buildAnimationMixer = (scene: Scene): AnimationMixer => {
    return new AnimationMixer(scene);
}
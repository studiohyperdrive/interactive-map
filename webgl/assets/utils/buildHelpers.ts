import { AnimationMixer, Clock, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer } from "three";

import { ISize, IPosition } from "../../types";

import { calculateCursorX, calculateCursorY } from "./generalHelpers";

export const buildScene = (): Scene => {
    return new Scene();
};

export const buildRenderer = (canvas: HTMLCanvasElement, sizes: ISize): WebGLRenderer => {
    const renderer: WebGLRenderer = new WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return renderer;
};

export const buildCamera = (scene: Scene, sizes: ISize, position: IPosition): PerspectiveCamera => {
    const camera: PerspectiveCamera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(position.x, position.y, position.z);
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
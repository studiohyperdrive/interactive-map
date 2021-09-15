import * as THREE from 'three';
import { ISize, IPosition } from '../../types';

export const buildScene = (): THREE.Scene => {
    return new THREE.Scene();
};

export const buildRenderer = (canvas: HTMLCanvasElement , sizes: ISize): THREE.WebGLRenderer => {
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return renderer;
};

export const buildCamera = (scene: THREE.Scene, sizes: ISize, position: IPosition): THREE.PerspectiveCamera => {
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(new THREE.Vector3),
    scene.add(camera);

    return camera;
};

export const buildClock = (): THREE.Clock => {
    return new THREE.Clock();
};
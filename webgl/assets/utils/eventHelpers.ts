import * as THREE from 'three';
import { ISize } from '../../types';

export const onWindowResize = (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera): ISize => {
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return sizes;
};
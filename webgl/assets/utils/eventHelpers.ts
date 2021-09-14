import * as THREE from 'three';
import { Sizes } from '../../types';

export const onWindowResize = (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, sizes: Sizes): void => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
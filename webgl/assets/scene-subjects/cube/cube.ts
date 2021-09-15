import * as THREE from 'three';

import { CubeTypes } from './cube.types';

const Cube = (scene: THREE.Scene, clock: THREE.Clock): CubeTypes => {
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

    const update = () => {
        const elapsedTime = clock.getElapsedTime();
        mesh.rotation.set(elapsedTime, elapsedTime, 0);
    };

    return {
        update,
    };
};

export default Cube;
import * as THREE from 'three';

import { ICube } from './cube.types';

export default class Cube extends THREE.Mesh implements ICube {
    constructor(scene: THREE.Scene) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        super(geometry, material);
        scene.add(this);
    }

    public update(clock: THREE.Clock): void {
        const elapsedTime = clock.getElapsedTime();
        this.rotation.set(elapsedTime, elapsedTime, 0);
    };
}
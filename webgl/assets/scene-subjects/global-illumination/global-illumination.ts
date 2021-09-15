import * as THREE from 'three';

import { GlobalIlluminationTypes } from './global-illumination.types';

const GlobalIllumination = (scene: THREE.Scene): GlobalIlluminationTypes => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0.2);
    scene.add(directionalLight);

    const update = () => {
        //
    };

    return {
        update,
    };
};

export default GlobalIllumination;
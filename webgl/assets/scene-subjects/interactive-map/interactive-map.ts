import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { InteractiveMapTypes } from './interactive-map.types';

const InteractiveMap = (scene: THREE.Scene): InteractiveMapTypes => {
    let sceneInstance: THREE.Group | null = null;

	// Add DRACO loader

    // Add loader
    const loader = new GLTFLoader();
    loader.load('/models/interactive-map_v1.glb', 
    (gltf) => {
        sceneInstance = gltf.scene;
        scene.add(gltf.scene);
    });

    // Add map to schene

    const update = () => {
        if (sceneInstance) {
            sceneInstance.rotation.y -= 0.001;
        };
    };

    return {
        update,
    };
};

export default InteractiveMap;
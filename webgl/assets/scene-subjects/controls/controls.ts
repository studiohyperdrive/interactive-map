import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';

import { IMapControls } from './controls.types';

export default class Controls implements IMapControls {
    public mapControls;

    constructor(camera: THREE.Camera, canvas: HTMLCanvasElement) {
        this.mapControls = this.createOribitControls(camera, canvas);
    }

    public update() {
        this.mapControls.update();
    };

    public createOribitControls(camera: THREE.Camera, canvas: HTMLCanvasElement): MapControls {
        const orbitControls = new MapControls(camera, canvas);
        orbitControls.enableDamping = true;
    
        // Vertical rotation limits
        orbitControls.minPolarAngle = Math.PI / 2 + camera.rotation.x
        orbitControls.maxPolarAngle = Math.PI / 2 + camera.rotation.x
    
        // Horizontal rotation limits
        orbitControls.minAzimuthAngle = - Math.PI / 4
        orbitControls.maxAzimuthAngle = Math.PI / 4
    
        // Dolly (zoom) limits
        orbitControls.minDistance = 2;
        orbitControls.maxDistance = 5;

        return orbitControls
    }
};
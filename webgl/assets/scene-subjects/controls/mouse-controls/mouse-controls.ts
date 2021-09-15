import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';

import { IMapControls } from './mouse-controls.types';

export default class MouseControls implements IMapControls {
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
        orbitControls.enableRotate = false;
        
        orbitControls.dampingFactor = 0.1;
        orbitControls.panSpeed = 0.5;
        orbitControls.zoomSpeed = 0.3;
        
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
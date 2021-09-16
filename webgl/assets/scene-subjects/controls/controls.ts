import * as THREE from 'three';
import { MapControls } from '../../modified/orbitControls/OrbitControls';

import { IMapControls } from './controls.types';

export default class MouseControls implements IMapControls {
    public mapControls;

    public rotationStep;

    public rotateLeftButton;
    public rotateRightButton;

    constructor(camera: THREE.Camera, canvas: HTMLCanvasElement) {
        this.mapControls = this.createOribitControls(camera, canvas);

        this.rotationStep = Math.PI/12;

        this.rotateLeftButton = document.querySelector('#webgl__rotate-left');
        this.rotateLeftButton?.addEventListener('click', this.handleClickRotateLeft);
        
        this.rotateRightButton = document.querySelector('#webgl__rotate-right');
        this.rotateRightButton?.addEventListener('click', this.handleClickRotateRight);
    }

    public update() {
        this.mapControls.update();
    };

    public createOribitControls(camera: THREE.Camera, canvas: HTMLCanvasElement): MapControls {
        const mapControls = new MapControls(camera, canvas);
        mapControls.enableDamping = true;
        mapControls.enableRotate = false;
        
        mapControls.dampingFactor = 0.1;
        mapControls.panSpeed = 0.5;
        mapControls.zoomSpeed = 0.3;
        
        // Vertical rotation limits
        mapControls.minPolarAngle = Math.PI / 2 + camera.rotation.x
        mapControls.maxPolarAngle = Math.PI / 2 + camera.rotation.x
        
        // Horizontal rotation limits
        // mapControls.minAzimuthAngle = - Math.PI / 4
        // mapControls.maxAzimuthAngle = Math.PI / 4
    
        // Dolly (zoom) limits
        mapControls.minDistance = 2;
        mapControls.maxDistance = 5;
        return mapControls
    }

    public handleClickRotateLeft = () => {        
        this.mapControls.rotate(this.rotationStep);
    }

    public handleClickRotateRight = () => {
        this.mapControls.rotate(-this.rotationStep);
    }
};
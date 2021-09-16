import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

import { rotateArountPoint } from '../../utils/generalHelpers';
import { IMapControls } from './controls.types';

export default class Controls implements IMapControls {
    public mapControls;
    public camera;

    public rotationDelta;

    public rotateLeftButton;
    public rotateRightButton;

    constructor(camera: THREE.Camera, canvas: HTMLCanvasElement) {
        this.mapControls = this.createOribitControls(camera, canvas);
        this.camera = camera;

        this.rotationDelta = 0;

        this.rotateLeftButton = document.querySelector('#webgl__rotate-left');
        this.rotateLeftButton?.addEventListener('click', this.handleClickRotateLeft);
        
        this.rotateRightButton = document.querySelector('#webgl__rotate-right');
        this.rotateRightButton?.addEventListener('click', this.handleClickRotateRight);
    }

    public update() {
        this.mapControls.update();

        // Add damping to rotation
        this.mapControls.enabled = false;
        rotateArountPoint(this.camera, this.mapControls.target, new THREE.Vector3(0, 1, 0), this.rotationDelta);
        this.rotationDelta *= (1 - 0.05);
        this.mapControls.enabled = true;
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
    
        // Dolly (zoom) limits
        mapControls.minDistance = 2;
        mapControls.maxDistance = 4;

        // Panning limits
        const minPan = new THREE.Vector3(-1, 0, -2);
        const maxPan = new THREE.Vector3(1, 0, 0);
        const _v = new THREE.Vector3();
        
        mapControls.addEventListener("change", () => {
            _v.copy(mapControls.target);
            mapControls.target.clamp(minPan, maxPan);
            _v.sub(mapControls.target);
            camera.position.sub(_v);
        })

        return mapControls
    }

    public handleClickRotateLeft = () => {       
        this.rotationDelta = -Math.PI/270; 
    }

    public handleClickRotateRight = () => {
        this.rotationDelta = Math.PI/270; 
    }
};
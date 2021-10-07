import { Camera, Vector3 } from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { ISceneControlsConfig } from '../../types';

import { rotateAroundPoint } from '../../utils/general';
import IControls from './controls.types';

export default class Controls implements IControls {
    public config;

    public mapControls;
    public camera;

    public rotationDelta;

    constructor(camera: Camera, canvas: HTMLCanvasElement, config: ISceneControlsConfig) {
        this.config = config;

        this.mapControls = this.createOrbitControls(camera, canvas);
        this.camera = camera;

        this.rotationDelta = 0;
    }

    public update() {
        if (this.mapControls.enableDamping) {
            this.mapControls.update();
        }
        
        // Add damping to rotation
        this.mapControls.enabled = false;
        rotateAroundPoint(this.camera, this.mapControls.target, new Vector3(0, 1, 0), this.rotationDelta);
        this.rotationDelta *= (1 - 0.05);
        this.mapControls.enabled = true;
    };

    public createOrbitControls(camera: Camera, canvas: HTMLCanvasElement): MapControls {
        const mapControls = new MapControls(camera, canvas);
        if (this.config.enableDamping) {
            mapControls.enableDamping = this.config.enableDamping;
        }
        if (this.config.enableRotate) {
            mapControls.enableRotate = this.config.enableRotate;
        }
        if (this.config.enablePan) {
            mapControls.enablePan = this.config.enablePan;
        }
        if (this.config.enableZoom) {
            mapControls.enableZoom = this.config.enableZoom;
        }
        if (this.config.dampingFactor) {
            mapControls.dampingFactor = this.config.dampingFactor;
        }
        if (this.config.rotateSpeed) {
            mapControls.rotateSpeed = this.config.rotateSpeed;
        }
        if (this.config.panSpeed) {
            mapControls.panSpeed = this.config.panSpeed;
        }
        if (this.config.zoomSpeed) {
            mapControls.zoomSpeed = this.config.zoomSpeed
        }
        if (this.config.mouseButtons) {
            mapControls.mouseButtons = this.config.mouseButtons
        }
        if (this.config.touches) {
            mapControls.touches = this.config.touches
        }
        if (this.config.rotationLimits) {
            const limits = this.config.rotationLimits;

            // Vertical rotation limits
            mapControls.minPolarAngle = limits.minPolarAngle? limits.minPolarAngle : Infinity;
            mapControls.maxPolarAngle = limits.maxPolarAngle? limits.maxPolarAngle : Infinity;

            // Horizontal rotation limits
            mapControls.minAzimuthAngle = limits.minAzimuthAngle? limits.minAzimuthAngle : Infinity;
            mapControls.maxAzimuthAngle = limits.maxAzimuthAngle? limits.maxAzimuthAngle : Infinity;
        }
        if (this.config.panLimits) {
            const limits = this.config.panLimits;

            // Panning limits
            const minPan = limits.minPan? limits.minPan : new Vector3(Infinity, Infinity, Infinity);
            const maxPan = limits.maxPan? limits.maxPan : new Vector3(Infinity, Infinity, Infinity);
            const _v = new Vector3();
            
            mapControls.addEventListener("change", () => {
                _v.copy(mapControls.target);
                mapControls.target.clamp(minPan, maxPan);
                _v.sub(mapControls.target);
                camera.position.sub(_v);
            })
        }
        if (this.config.distanceLimits) {
            const limits = this.config.distanceLimits;

            // Dolly (distance) limits
            mapControls.minDistance = limits.minDistance? limits.minDistance : 0;
            mapControls.maxDistance = limits.maxDistance? limits.maxDistance : Infinity;
        }
        if (this.config.zoomLimits) {
            const limits = this.config.zoomLimits;

            // Dolly (zoom) limits
            mapControls.minZoom = limits.minZoom? limits.minZoom : 0;
            mapControls.maxZoom = limits.maxZoom? limits.maxZoom : Infinity;
        }
        return mapControls
    }

    public handleClickRotateLeft = () => {       
        this.rotationDelta = -Math.PI/270; 
    }

    public handleClickRotateRight = () => {
        this.rotationDelta = Math.PI/270; 
    }
};
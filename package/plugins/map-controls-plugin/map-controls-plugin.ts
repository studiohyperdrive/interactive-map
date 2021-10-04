import { Camera, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import { IDataStore } from "../../data-store/data-store.types";

import { IMapControlsPlugin, IMapControlsConfig } from "./map-controls-plugin.types";

export class MapControlsPlugin {
    constructor(config: IMapControlsConfig) {
        return class implements IMapControlsPlugin {
            private dataStore: IDataStore;

            public camera: Camera;
            public canvas: HTMLCanvasElement;
            public mapControls: MapControls;
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.camera = dataStore.get("camera");
                this.canvas = dataStore.get("canvas");
                this.mapControls = this.createMapControls(this.camera, this.canvas);
            }

            public update() {
                this.mapControls.update();
        
                // this.mapControls.enabled = false;
                //     Update the camera here
                // this.mapControls.enabled = true;
            };
        
            public createMapControls(camera: Camera, canvas: HTMLCanvasElement): MapControls {
                const mapControls = new MapControls(camera, canvas);
                if (config.enableDamping) {
                    mapControls.enableDamping = config.enableDamping;
                }
                if (config.enableRotate) {
                    mapControls.enableRotate = config.enableRotate;
                }
                if (config.enablePan) {
                    mapControls.enablePan = config.enablePan;
                }
                if (config.enableZoom) {
                    mapControls.enableZoom = config.enableZoom;
                }
                if (config.dampingFactor) {
                    mapControls.dampingFactor = config.dampingFactor;
                }
                if (config.rotateSpeed) {
                    mapControls.rotateSpeed = config.rotateSpeed;
                }
                if (config.panSpeed) {
                    mapControls.panSpeed = config.panSpeed;
                }
                if (config.zoomSpeed) {
                    mapControls.zoomSpeed = config.zoomSpeed
                }
                if (config.mouseButtons) {
                    mapControls.mouseButtons = config.mouseButtons
                }
                if (config.touches) {
                    mapControls.touches = config.touches
                }
                if (config.rotationLimits) {
                    const limits = config.rotationLimits;
        
                    // Vertical rotation limits
                    mapControls.minPolarAngle = limits.minPolarAngle? limits.minPolarAngle : Infinity;
                    mapControls.maxPolarAngle = limits.maxPolarAngle? limits.maxPolarAngle : Infinity;
        
                    // Horizontal rotation limits
                    mapControls.minAzimuthAngle = limits.minAzimuthAngle? limits.minAzimuthAngle : Infinity;
                    mapControls.maxAzimuthAngle = limits.maxAzimuthAngle? limits.maxAzimuthAngle : Infinity;
                }
                if (config.panLimits) {
                    const limits = config.panLimits;
        
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
                if (config.distanceLimits) {
                    const limits = config.distanceLimits;
        
                    // Dolly (distance) limits
                    mapControls.minDistance = limits.minDistance? limits.minDistance : 0;
                    mapControls.maxDistance = limits.maxDistance? limits.maxDistance : Infinity;
                }
                if (config.zoomLimits) {
                    const limits = config.zoomLimits;
        
                    // Dolly (zoom) limits
                    mapControls.minZoom = limits.minZoom? limits.minZoom : 0;
                    mapControls.maxZoom = limits.maxZoom? limits.maxZoom : Infinity;
                }
        
        
                return mapControls
            }
        }
    }
}
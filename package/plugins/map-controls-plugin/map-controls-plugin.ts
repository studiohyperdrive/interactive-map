import { Camera, Vector3 } from "three";
import { rotateAroundPoint } from "../../utils";
import { IDataStore } from "../../data-store/data-store.types";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";
import { IMapControlsPlugin } from "./map-controls-plugin.types";

export default class MapControlsPlugin {
    constructor() {
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
                const minPan = new Vector3(-1, 0, -2);
                const maxPan = new Vector3(1, 0, 0);
                const _v = new Vector3();
                
                mapControls.addEventListener("change", () => {
                    _v.copy(mapControls.target);
                    mapControls.target.clamp(minPan, maxPan);
                    _v.sub(mapControls.target);
                    camera.position.sub(_v);
                })
        
                return mapControls
            }
        }
    }
}
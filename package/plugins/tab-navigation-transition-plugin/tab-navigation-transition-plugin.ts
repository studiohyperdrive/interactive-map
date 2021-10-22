import { OrthographicCamera, PerspectiveCamera, Sphere, Vector3, MathUtils, Box3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { ITabNavigationTransitionPlugin } from "./tab-navigation-transition-plugin.types";

export class TabNavigationTransitionPlugin {
    constructor(speed: number) {
        return class implements ITabNavigationTransitionPlugin {
            private dataStore: IDataStore;
            private currentTarget: Box3 | undefined;
            private animating: boolean;

            public controls: MapControls;
            public camera: PerspectiveCamera | OrthographicCamera;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;
                this.currentTarget = undefined;
                this.animating = false;

                this.controls = dataStore.get(constants.store.controls);
                this.camera = dataStore.get(constants.store.camera);
            }

            public update() {
                const delta = this.dataStore.get(constants.store.deltaTime);
                const zoomProps = this.dataStore.get(constants.store.zoomProps);

                if (zoomProps) { // Only exists when zoomCameraToSelection util is fired at least once
                    if (this.currentTarget !== zoomProps.boundingBox || this.animating) { // Only animate towards new objects or keep animating if not finished
                        if (this.currentTarget !== zoomProps.boundingBox) {
                            this.currentTarget = zoomProps.boundingBox;
                            this.animating = true;
                        }

                        // Point to animate towards
                        const target = zoomProps.boundingBox.getCenter(new Vector3());
    
                        if (this.controls.target.distanceTo(target) > 0.01) {
                            // Animate orbitcontrols focus point
                            this.controls.target.lerp(target, delta * speed);

                            // Animate camera position
                            this.camera.position.lerp((target.sub(zoomProps.direction)), delta * speed);
                            this.controls.update();
                        } else {
                            this.animating = false;
                        }
        
                        // Animate orthographic zoom level
                        if (this.camera instanceof OrthographicCamera) {
                            const bSphere = zoomProps.boundingBox.getBoundingSphere(new Sphere(target));
                            const zoom = MathUtils.lerp(this.camera.top, bSphere.radius * zoomProps.fitRatio, delta * speed);

                            this.camera.top = zoom;
                            this.camera.bottom = - zoom;
                            this.camera.right = zoom * zoomProps.aspect;
                            this.camera.left = - zoom * zoomProps.aspect;
                        }

                        this.camera.updateProjectionMatrix();
                    }
                    
                }
            }
        }
    }
}

export default TabNavigationTransitionPlugin;
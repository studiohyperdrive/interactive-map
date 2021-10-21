import { OrthographicCamera, PerspectiveCamera, Sphere, Vector3, MathUtils } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { ITabNavigationTransitionPlugin } from "./tab-navigation-transition-plugin.types";

export class TabNavigationTransitionPlugin {
    constructor(speed: number) {
        return class implements ITabNavigationTransitionPlugin {
            private dataStore: IDataStore;

            public controls: MapControls;
            public camera: PerspectiveCamera | OrthographicCamera;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.controls = dataStore.get(constants.store.controls);
                this.camera = dataStore.get(constants.store.camera);
            }

            public update() {
                const delta = this.dataStore.get(constants.store.deltaTime);
                const zoomProps = this.dataStore.get(constants.store.zoomProps);

                if (zoomProps) {
                    const target = zoomProps.boundingBox.getCenter(new Vector3());
    
                    // Animate camera position
                    this.controls.target.lerp(target, delta * speed);
                    this.controls.update();
    
                    // Animate zoom level
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

export default TabNavigationTransitionPlugin;
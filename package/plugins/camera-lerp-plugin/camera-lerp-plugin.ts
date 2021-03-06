import { OrthographicCamera, PerspectiveCamera, Sphere, Vector3, MathUtils, Box3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import constants from "../../constants";
import { IDataStore } from "../../data-store/data-store.types";

import { ICameraLerpPlugin } from "./camera-lerp-plugin.types";

export class CameraLerpPlugin {
    constructor(speed: number) {
        return class implements ICameraLerpPlugin {
            private dataStore: IDataStore;
            private currentTarget: Box3 | undefined;
            private animating: boolean;

            public camera: PerspectiveCamera | OrthographicCamera;
            public controls: MapControls;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.currentTarget = undefined;
                this.animating = false;

                this.controls = this.dataStore.get(constants.store.controls);
                this.camera = this.dataStore.get(constants.store.camera);
            }

            public isAnimating(): boolean {
                return this.animating;
            }

            public update() {
                const zoomProps = this.dataStore.get(constants.store.zoomProps);

                if (zoomProps) { // Only exists when zoomCameraToSelection util is fired at least once
                    if (this.currentTarget !== zoomProps.boundingBox || this.animating) { // Only animate towards new objects or keep animating if not finished
                        if (this.currentTarget !== zoomProps.boundingBox) {
                            this.currentTarget = zoomProps.boundingBox;
                            this.animating = true;
                        }

                        // Point to animate towards
                        const target = zoomProps.boundingBox.getCenter(new Vector3());

                        // Fetch fresh instances
                        this.controls = this.dataStore.get(constants.store.controls);
                        this.camera = this.dataStore.get(constants.store.camera);

                        const delta = this.dataStore.get(constants.store.deltaTime);

                        // Animate orthographic zoom level
                        if (this.camera instanceof OrthographicCamera) {
                            const bSphere = zoomProps.boundingBox.getBoundingSphere(new Sphere(target));
                            const zoom = MathUtils.lerp(
                                this.camera.top,
                                zoomProps.frustum
                                    ? zoomProps.frustum / 2
                                    : bSphere.radius * zoomProps.fitRatio,
                                delta * speed
                            );

                            this.camera.left = - zoom * zoomProps.aspect;
                            this.camera.right = zoom * zoomProps.aspect;
                            this.camera.top = zoom;
                            this.camera.bottom = - zoom;
                        }

                        if (this.controls.target.distanceTo(target) > 0.001) {
                            // Animate orbitcontrols focus point
                            this.controls.target.lerp(target, delta * speed);

                            // Animate camera position
                            this.camera.position.lerp((target.sub(zoomProps.direction)), delta * speed);
                            this.controls.update();

                            this.camera.updateProjectionMatrix();

                            console.info('cycle');
                        } else {
                            this.animating = false;
                        }
                    }

                }
            }
        };
    }
}

export default CameraLerpPlugin;
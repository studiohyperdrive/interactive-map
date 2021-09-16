import * as THREE from 'three';

import { IGlobalIllumination } from './global-illumination.types';

export default class GlobalIllumination implements IGlobalIllumination {
    public ambient;
    public directional;

    constructor(scene: THREE.Scene) {
        this.ambient = this.createAmbient();
        this.directional = this.createDirectional();

        scene.add(this.ambient);
        scene.add(this.directional);
    }

    public update() { }

    public createAmbient() {
        return new THREE.AmbientLight(0xffffff, 0.5);
    }

    public createDirectional() {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 0.2);

        return light;
    }
}
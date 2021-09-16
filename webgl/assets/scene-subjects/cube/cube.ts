import { BoxGeometry, Clock, Mesh, MeshBasicMaterial, Scene } from "three";

import { ICube } from "./cube.types";

export default class Cube extends Mesh implements ICube {
    constructor(scene: Scene) {
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: 0xffffff });

        super(geometry, material);
        scene.add(this);
    }

    public update(clock: Clock): void {
        const elapsedTime = clock.getElapsedTime();
        this.rotation.set(elapsedTime, elapsedTime, 0);
    };
}
import * as THREE from 'three';
import gsap from 'gsap';

import { IRotateControls } from './rotate-controls.types';

export default class RotateControls implements IRotateControls {
    public camera;

    public pivot;
    public rotation;

    public rotateLeftButton;
    public rotateRightButton;


    constructor(camera: THREE.Camera) {
        this.camera = camera;
        
        this.pivot = new THREE.Group();
        this.pivot.position.set(0, 0, 0);
        this.pivot.add(this.camera);
        this.rotation = 0;

        this.rotateLeftButton = document.querySelector('#webgl__rotate-left');
        this.rotateLeftButton?.addEventListener('click', this.handleClickRotateLeft);
        
        this.rotateRightButton = document.querySelector('#webgl__rotate-right');
        this.rotateRightButton?.addEventListener('click', this.handleClickRotateRight);
    }

    public update() {
        this.pivot.rotation.y = this.rotation;
    };

    public handleClickRotateLeft = () => {
       gsap.to(this, {rotation: this.rotation - Math.PI / 10})
    }

    public handleClickRotateRight = () => {        
        gsap.to(this, {rotation: this.rotation + Math.PI / 10})
    }
};
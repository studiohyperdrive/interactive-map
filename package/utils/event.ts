import { PerspectiveCamera, WebGLRenderer } from "three";

import { ISize } from "../types";

export const onWindowResize = (renderer: WebGLRenderer, camera: PerspectiveCamera): ISize => {
    const canvas = renderer.domElement
    const div = canvas.parentElement;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // No sizing wrapper -> window
    const sizes = {
        width: div?.classList.contains("im__webgl--container")? div.clientWidth : window.innerWidth,
        height: div?.classList.contains("im__webgl--container")? div.clientHeight : window.innerHeight,
    }

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return sizes;
};
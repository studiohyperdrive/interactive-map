import { PerspectiveCamera, WebGLRenderer } from "three";

import { ISize } from "../../types";

export const onWindowResize = (renderer: WebGLRenderer, camera: PerspectiveCamera): ISize => {
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return sizes;
};

export const debounce = (func: Function, timeout = 50) => {
    let timer: NodeJS.Timeout;

    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
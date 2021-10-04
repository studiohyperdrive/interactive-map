import { OrthographicCamera, PerspectiveCamera, WebGLRenderer } from "three";

import { ISize, IOrthographicCameraConfig, IPerspectiveCameraConfig } from "../types";

export const onWindowResize = (renderer: WebGLRenderer, camera: PerspectiveCamera | OrthographicCamera, cameraConfig: IOrthographicCameraConfig | IPerspectiveCameraConfig): ISize => {
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

    if (camera instanceof PerspectiveCamera) {
        camera.aspect = sizes.width / sizes.height;
    }

    if (camera instanceof OrthographicCamera) {
        const aspectRatio = sizes.width / sizes.height;

        camera.left = (cameraConfig as IOrthographicCameraConfig).frustumSize * aspectRatio / - 2;
        camera.right = (cameraConfig as IOrthographicCameraConfig).frustumSize * aspectRatio / 2;
        camera.top = (cameraConfig as IOrthographicCameraConfig).frustumSize / 2;
        camera.bottom = (cameraConfig as IOrthographicCameraConfig).frustumSize / - 2;
    }

    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return sizes;
};
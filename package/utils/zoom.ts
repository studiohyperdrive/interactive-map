import { Box3, Mesh, Object3D, OrthographicCamera, PerspectiveCamera, Sphere, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

export const zoomCameraToSelection = (camera: PerspectiveCamera | OrthographicCamera, controls: MapControls, selection: Array<Object3D | Mesh>, fitRatio = 1.2) => {
    // Create new bounding box based on selection

    const box = new Box3();

    for (const object of selection) box.expandByObject(object);

    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const aspect = getAspectRatioFromControls(controls);

    // Determine FOV

    let fov = Math.atan(aspect);

    if (camera instanceof PerspectiveCamera) {
        fov = camera.fov;
    }

    if (camera instanceof OrthographicCamera) {
        // Set ortho zoom based on bounding sphere

        let bsphere = box.getBoundingSphere(new Sphere(center));

        camera.top = bsphere.radius * fitRatio;
        camera.bottom = - bsphere.radius * fitRatio;
        camera.right = bsphere.radius * aspect * fitRatio;
        camera.left = - bsphere.radius * aspect * fitRatio;
    }

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * fov) / 360));
    const fitWidthDistance = fitHeightDistance / aspect;
    const distance = fitRatio * Math.max(fitHeightDistance, fitWidthDistance);

    const direction = controls.target
        .clone()
        .sub(camera.position)
        .normalize()
        .multiplyScalar(distance);

    controls.maxDistance = distance * 10;
    controls.target.copy(center);

    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    camera.position.copy(controls.target).sub(direction);

    controls.update();
}

const getAspectRatioFromControls = (controls: MapControls): number => {
    // Determine aspect ratio

    let container = undefined;

    if (controls.domElement instanceof Document) {
        container = controls.domElement.body;
    }

    if (controls.domElement instanceof HTMLElement) {
        container = controls.domElement
    }

    return container ? container.clientWidth / container.clientHeight : 1;
}
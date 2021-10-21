import { Box3, Mesh, Object3D, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

export const zoomCameraToSelection = (camera: PerspectiveCamera | OrthographicCamera, controls: MapControls, selection: Array<Object3D | Mesh>, setZoomProps: (props: any) => void, fitRatio = 1.2) => {
    // Create new bounding box based on selection
    const box = new Box3();

    for (const object of selection) box.expandByObject(object);

    // Determine FOV
    const aspect = getAspectRatioFromControls(controls);
    
    let fov = Math.atan(aspect);

    if (camera instanceof PerspectiveCamera) {
        fov = camera.fov;
    }
    
    // adjust camera settings
    const size = box.getSize(new Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * fov) / 360));
    const fitWidthDistance = fitHeightDistance / aspect;
    const distance = fitRatio * Math.max(fitHeightDistance, fitWidthDistance);

    const direction = controls.target
        .clone()
        .sub(camera.position)
        .normalize()
        .multiplyScalar(distance);

    controls.update();

    // Set zoomProps for transition in tab-navigation-transition-plugin
    setZoomProps({
        boundingBox: box,
        aspect: aspect,
        fitRatio: fitRatio,
        direction: direction,
    });
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
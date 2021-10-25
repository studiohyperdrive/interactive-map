import { Box3, Mesh, Object3D, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";
import { IOrthographicCameraConfig, IPerspectiveCameraConfig } from "../types";

/**
 * This function will adjust the camera and controls to zoom in and center on a set of objects.
 * 
 * @param camera The active camera
 * @param controls The MapControls instance governing interaction
 * @param selection A selection of objects to center on
 * @param setZoomProps A function exposed by the TabNavigationPlugin that updates the zoomProps value in the package's internal Datastore
 * @param fitRatio A number dictating how much "padding" should be around the zoomed-to object
 */
export const zoomCameraToSelection = (
  camera: PerspectiveCamera | OrthographicCamera,
  controls: MapControls,
  selection: Array<Object3D | Mesh>,
  setZoomProps: (props: any) => void,
  fitRatio = 1.2
) => {
  // Create bounding box for selection  
  const box = new Box3();

  for (const object of selection) box.expandByObject(object);

  const size = box.getSize(new Vector3());
  const aspect = getAspectRatioFromControls(controls);

  // Determine fov
  let fov = Math.atan(aspect);

  if (camera instanceof PerspectiveCamera) {
    fov = camera.fov;
  }

  // Save direction of camera
  const direction = controls.target
    .clone()
    .sub(camera.position)

  // Calculate zoom distance for perspective camera
  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * fov) / 360));
  const fitWidthDistance = fitHeightDistance / aspect;
  const distance = fitRatio * Math.max(fitHeightDistance, fitWidthDistance);

  // add zoom distance to direction for perspective camera
  if (camera instanceof PerspectiveCamera) {
    direction
      .normalize()
      .multiplyScalar(distance);
  }

  // Set zoomProps for transition in camera-lerp-plugin
  setZoomProps({
    boundingBox: box,
    aspect: aspect,
    fitRatio: fitRatio,
    direction: direction,
  });
}

export const setCameraToConfig = (
  camera: PerspectiveCamera | OrthographicCamera,
  controls: MapControls,
  config: IOrthographicCameraConfig | IPerspectiveCameraConfig,
  setZoomProps: (props: any) => void,
) => {
  const ratio = getAspectRatioFromControls(controls);

  // Stop any animations
  setZoomProps(undefined);

  // Coordinate 0, 0, 0
  const OOO = new Vector3;

  camera.position.set(config.position.x, config.position.y, config.position.z);
  camera.lookAt(OOO);

  controls.target.set(OOO.x, OOO.y, OOO.z);

  // instanceof operator does not work here
  switch (camera.type) {
    case "OrthographicCamera":
      const orthoConfig = config as IOrthographicCameraConfig;

      camera.left = orthoConfig.frustumSize * ratio / - 2;
      camera.right = orthoConfig.frustumSize * ratio / 2;
      camera.top = orthoConfig.frustumSize / 2;
      camera.bottom = orthoConfig.frustumSize / - 2;
      break;

    case "PerspectiveCamera":
      const perspectiveConfig = config as PerspectiveCamera;

      camera.fov = perspectiveConfig.fov;
      camera.aspect = ratio;
      break;
  
    default:
      break;
  }

  camera.near = config.near;
  camera.far = config.far;

  controls.update();
  camera.updateProjectionMatrix();
}

export const getAspectRatioFromControls = (controls: MapControls): number => {
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
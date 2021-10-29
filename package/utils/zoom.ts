import { Box3, Mesh, Object3D, PerspectiveCamera, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import constants from "../constants";
import { IOrthographicCameraConfig, IPerspectiveCameraConfig } from "../types";

import { IDataStore } from "../data-store/data-store.types";

// Coordinate 0, 0, 0
const OOO = new Vector3;

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

/**
 * This function will adjust the camera and controls to zoom in and center on a set of objects.
 * 
 * ⚠️ **NOTE:** To allow this function to work, make sure the object you are selecting is within the `panLimits` of your `MapControls` instance.
 * If these `panLimits` are set to min/max 0,0,0 nothing will happen
 * 
 * @param selection A selection of objects to center on
 * @param store The IDataStore instance exposed by e.g. "action" plugins (click/hover/tab/...)
 * @param fitRatio A number dictating how much "padding" should be around the zoomed-to object
 */
export const zoomCameraToSelection = (
  selection: Array<Object3D | Mesh>,
  store: IDataStore,
  fitRatio = 1.2
) => {
  const camera = store.get(constants.store.camera);
  const controls = store.get(constants.store.controls);
  const setZoomProps = (data: any) => store.set(constants.store.zoomProps, data);
  
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
  store: IDataStore,
  config: IOrthographicCameraConfig | IPerspectiveCameraConfig,
) => {
  const camera = store.get(constants.store.camera);
  const controls = store.get(constants.store.controls);
  const setZoomProps = (data: any) => store.set(constants.store.zoomProps, data);

  const ratio = getAspectRatioFromControls(controls);

  // Stop any animations
  setZoomProps(undefined);

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
      const perspectiveConfig = config as IPerspectiveCameraConfig;

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

export const zoomCameraToConfig = (
  store: IDataStore,
  config: IOrthographicCameraConfig | IPerspectiveCameraConfig
) => {
  const origin = new Object3D();
  origin.position.set(config.position.x, config.position.y, config.position.z);

  zoomCameraToSelection([origin], store);

  // Identify type of config
  if ((config as IOrthographicCameraConfig).frustumSize) {
    let c = config as IOrthographicCameraConfig;

    const props = store.get(constants.store.zoomProps);
    store.set(constants.store.zoomProps, {
      ...props,
      frustum: c.frustumSize
    });
  }
}
import { Camera, MOUSE, TOUCH, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import { IScenePlugin } from "../../types";

export interface IMapControlsPlugin extends IScenePlugin {
    camera: Camera;
    canvas: HTMLCanvasElement,
    mapControls: MapControls,
    createMapControls: (camera: Camera, canvas: HTMLCanvasElement) => MapControls,
}

// Config

export interface IControlsMouseButtons {
    LEFT: MOUSE,
    MIDDLE: MOUSE,
    RIGHT: MOUSE,
}

export interface IControlsTouches {
    ONE: TOUCH,
    TWO: TOUCH,
}

export interface IControlsRotationLimits {
    minPolarAngle: number,
    maxPolarAngle: number,
    minAzimuthAngle: number,
    maxAzimuthAngle: number,
}

export interface IControlsPanLimits {
    minPan: Vector3,
    maxPan: Vector3,
}

export interface IControlsDistanceLimits {
    minDistance: number,
    maxDistance: number,
}

export interface IControlsZoomLimits {
    minZoom: number,
    maxZoom: number,
}

export interface IMapControlsConfig {
    enableDamping?: boolean,
    enableRotate?: boolean,
    enablePan?: boolean,
    enableZoom?: boolean,
    dampingFactor?: number,
    rotateSpeed?: number,
    panSpeed?: number,
    zoomSpeed?: number,
    mouseButtons?: IControlsMouseButtons,
    touches?: IControlsTouches,
    rotationLimits?: IControlsRotationLimits,
    panLimits?: IControlsPanLimits
    distanceLimits?: IControlsDistanceLimits,
    zoomLimits?: IControlsZoomLimits,
}

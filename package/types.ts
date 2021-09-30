import { AnimationActionLoopStyles, MOUSE, TOUCH, Vector3 } from "three";

export interface ISize {
    width: number;
    height: number;
}

export interface IManager {
    update: Function;
    onWindowResizeCallback: Function;
}

export interface IPosition {
    x: number,
    y: number,
    z: number,
}

export interface IUpdates {
    update: Function;
}

export interface IBindingConfig {
    name: string,
    matching?: "exact" | "partial",
}

export interface IClickBindingConfig extends IBindingConfig{
    onClick: Function,
    animate?: IAnimate[],
}

export interface IHoverBindingConfig extends IBindingConfig{
    onHoverStart: Function,
    onHoverEnd: Function,
    animate?: IAnimate[],
}

export interface IAnimate extends IBindingConfig {
    loop: AnimationActionLoopStyles,
}

export interface IAnimationConfig extends IBindingConfig, IAnimate {
    startAnimation: Function,
}

export interface IPerspectiveCameraConfig {
    fov: number,
    near: number,
    far: number,
    position: IPosition,
}

export interface IOrthographicCameraConfig {
    frustumSize: number,
    near: number,
    far: number,
    position: IPosition,
}

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

export interface ISceneControlsConfig {
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

export interface ICameraConfig {
    type: "orthographic" | "perspective",
    config: IOrthographicCameraConfig | IPerspectiveCameraConfig,
}
export interface ISceneConfig {
    map: string,
    camera: ICameraConfig,
    controls: ISceneControlsConfig,
}
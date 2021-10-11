import { AnimationActionLoopStyles, MOUSE, OrthographicCamera, PerspectiveCamera, Scene, TOUCH, Vector3, WebGLRenderer } from "three";

// Base

export interface IEntryPoint {
    canvas: HTMLCanvasElement;
	manager: IManager;
	sceneConfig: ISceneConfig;
	plugins: any[];
	interactive: boolean;
    bindEventListeners: () => void;
    unbindEventListeners: () => void;
    render: () => void;
}

export interface IManager {
    sizes: ISize;
	sceneConfig: ISceneConfig;
	scene: Scene;
	camera: PerspectiveCamera | OrthographicCamera;
	plugins: any[];
    update: Function;
}

export interface ISize {
    width: number;
    height: number;
}

export interface IPosition {
    x: number,
    y: number,
    z: number,
}

// Bindings

export interface IBindingConfig {
    name: string,
    matching?: "exact" | "partial",
    animate?: IAnimate[],
}

export interface IClickBindingConfig extends IBindingConfig{
    onClick: Function,
}

export interface IHoverBindingConfig extends IBindingConfig{
    onHoverStart: Function,
    onHoverEnd: Function,
}

export interface IAnimate extends IBindingConfig {
    loop: AnimationActionLoopStyles,
}

export interface IAnimationConfig extends IBindingConfig, IAnimate {
    startAnimation: Function;
}

// POC types
export interface IEventPlugin {
    bindEventListener: () => void,
    unbindEventListener: () => void,
}

export interface IScenePlugin {
    update: () => void,
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
    camera: ICameraConfig,
}

// Plugins

export interface IEventPlugin {
    bindEventListener: () => void,
    unbindEventListener: () => void,
}

export interface IScenePlugin {
    update: () => void,
}

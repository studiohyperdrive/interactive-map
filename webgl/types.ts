import { AnimationActionLoopStyles } from "three";

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
    startAnimation: Function;
}
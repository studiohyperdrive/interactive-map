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

export interface IClickBindingConfig {
    name: string,
    onClick: Function,
    onHoverStart: Function,
    onHoverEnd: Function,
    matching?: "exact" | "partial",
}
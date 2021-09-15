export interface Sizes {
    width: number;
    height: number;
}

export interface SceneManagerTypes {
    update: Function;
    onWindowResizeCallback: Function;
}

export interface Position {
    x: number,
    y: number,
    z: number,
}

export interface SceneSubject {
    update: Function;
}
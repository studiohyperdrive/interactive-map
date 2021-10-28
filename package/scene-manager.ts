import { OrthographicCamera, PerspectiveCamera, Scene } from "three";

import { IManager, ISize, ISceneConfig, IOrthographicCameraConfig, IPerspectiveCameraConfig } from "./types";
import { buildScene, buildPerspectiveCamera, buildOrthographicCamera } from "./utils/build";

import DataStore from "./data-store/data-store";
import constants from "./constants";

export default class SceneManager implements IManager {
	private dataStore: DataStore;

	public sizes: ISize;
	public sceneConfig: ISceneConfig;
	public scene: Scene;
	public camera: PerspectiveCamera | OrthographicCamera;
	public plugins: any[];

	constructor(canvas: HTMLCanvasElement, sceneConfig: ISceneConfig, dataStore: DataStore, scenePlugins: any[]) {
		this.dataStore = dataStore;

		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.sceneConfig = sceneConfig;

		this.scene = buildScene();
		this.camera = this.sceneConfig.camera.type === "orthographic" 
			? buildOrthographicCamera(this.scene, this.sizes, this.sceneConfig.camera.config as IOrthographicCameraConfig) 
			: buildPerspectiveCamera(this.scene, this.sizes, this.sceneConfig.camera.config as IPerspectiveCameraConfig);

		this.dataStore.set(constants.store.canvas, canvas);

		this.dataStore.set(constants.store.sizes, this.sizes);
		this.dataStore.set(constants.store.scene, this.scene);
		this.dataStore.set(constants.store.camera, this.camera);

		this.dataStore.set(constants.store.cameraConfig, sceneConfig.camera);

		this.plugins = scenePlugins.map(Plugin => new Plugin(this.dataStore));
	}

	/**
	 * Render cycle function, updates every updateable subject.
	 */
	public update(): void {
		this.plugins.forEach(plugin => {
			plugin.update();
		});
	}
};

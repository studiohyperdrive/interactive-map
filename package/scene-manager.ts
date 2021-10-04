import { OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from "three";

import { buildScene, buildRenderer, buildPerspectiveCamera, buildOrthographicCamera } from "./utils/build";

import { IManager, ISize, ISceneConfig, IOrthographicCameraConfig, IPerspectiveCameraConfig } from "./types";
import DataStore from "./data-store/data-store";

export default class SceneManager implements IManager {
	private dataStore: DataStore;
	
	public sizes: ISize;
	
	public sceneConfig: ISceneConfig;

	public scene: Scene;
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera | OrthographicCamera;

	public plugins: any[];
	
	constructor(canvas: HTMLCanvasElement, sceneConfig: ISceneConfig, dataStore: DataStore, plugins: any[]) {
		this.dataStore = dataStore;

		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.sceneConfig = sceneConfig;
		
		this.scene = buildScene();
		this.renderer = buildRenderer(canvas, this.sizes);
		this.camera = this.sceneConfig.camera.type === "orthographic" 
			? buildOrthographicCamera(this.scene, this.sizes, this.sceneConfig.camera.config as IOrthographicCameraConfig) 
			: buildPerspectiveCamera(this.scene, this.sizes, this.sceneConfig.camera.config as IPerspectiveCameraConfig);

		dataStore.set("sizes", this.sizes);

		dataStore.set("canvas", canvas);
		dataStore.set("scene", this.scene);
		dataStore.set("renderer", this.renderer);
		dataStore.set("camera", this.camera);
		dataStore.set("cameraConfig", sceneConfig.camera);
		
		this.plugins = plugins.map(Plugin => new Plugin(dataStore));
	}

	/**
	 * Render cycle function, updates every updateable subject.
	 */
	public update(): void {
		this.plugins.forEach(plugin => {
			plugin.update();
		});
		
		this.renderer.render(this.scene, this.camera);
	}
};

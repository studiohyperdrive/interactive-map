import { OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from "three";

import { buildScene, buildRenderer, buildOrthographicCamera, buildPerspectiveCamera } from "./utils/build";
import { onWindowResize } from "./utils/event";

import GlobalIllumination from './subjects/global-illumination/global-illumination';
import Controls from "./subjects/controls/controls";

import { IManager, ISize, IUpdates, ISceneConfig, IOrthographicCameraConfig, IPerspectiveCameraConfig } from "./types";
import DataStore from "./data-store/data-store";

export default class SceneManager implements IManager {
	private dataStore: DataStore;
	
	public sizes: ISize;
	
	public scene: Scene;
	public renderer: WebGLRenderer;
	public camera: OrthographicCamera | PerspectiveCamera;

	public sceneConfig: ISceneConfig;
	
	public controls: Controls;
	public subjects: IUpdates[] = [];
	
	public deltaTime: number;
	public previousTime: number;

	public plugins: any[];
	
	constructor(canvas: HTMLCanvasElement, sceneConfig: ISceneConfig, dataStore: DataStore, plugins: any[]) {
		this.dataStore = dataStore;

		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.sceneConfig = sceneConfig;

		this.deltaTime = 0;
		this.previousTime = 0;
		
		this.scene = buildScene();
		this.renderer = buildRenderer(canvas, this.sizes);
		this.camera = this.sceneConfig.camera.type === "orthographic" 
			? buildOrthographicCamera(this.scene, this.sizes, this.sceneConfig.camera.config as IOrthographicCameraConfig) 
			: buildPerspectiveCamera(this.scene, this.sizes, this.sceneConfig.camera.config as IPerspectiveCameraConfig);
		
		
		this.controls = new Controls(this.camera, canvas, this.sceneConfig.controls);
		this.subjects = this.createSubjects(this.scene);

		dataStore.set("scene", this.scene);
		dataStore.set("renderer", this.renderer);
		dataStore.set("camera", this.camera);
		
		this.plugins = plugins.map(Plugin => new Plugin(dataStore));
	}

	//
	// Rendering
	//

	/**
	 * Render cycle function, updates every updateable subject.
	 */
	public update(): void {
		this.plugins.forEach(plugin => {
			plugin.update();
		});
		
		this.renderer.render(this.scene, this.camera);
	}

	/**
	 * Callback function responsible for keeping the sizes object up-to-date.
	 */
	public onWindowResizeCallback(): void {
		this.sizes = onWindowResize(this.renderer, this.camera, this.sceneConfig.camera.config);
	}

	/**
	 * Create the initial elements in the given Scene
	 * @param scene scene object the subjects will be created in
	 * @returns an array of subjects that have update functions
	 */
	public createSubjects(scene: Scene): IUpdates[] {
		return [
			new GlobalIllumination(scene),
			this.controls
		];
	}
};

import { AnimationClip, AnimationMixer, Clock, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";

import { buildScene, buildRenderer, buildCamera, buildClock, buildRaycaster, buildAnimationMixer } from "./utils/build";
import { onWindowResize } from "./utils/event";

import GlobalIllumination from './subjects/global-illumination/global-illumination';
import Controls from "./subjects/controls/controls";

import { IAnimationConfig, IBindingConfig, IManager, ISize, IUpdates } from "./types";
import DataStore from "./data-store/data-store";

export default class SceneManager implements IManager {
	private dataStore: DataStore;
	
	public sizes: ISize;
	
	public scene: Scene;
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera;
	
	public controls: Controls;
	public subjects: IUpdates[] = [];
	
	public deltaTime: number;
	public previousTime: number;

	public plugins: any[];
	
	constructor(canvas: HTMLCanvasElement, dataStore: DataStore, plugins: any[]) {
		this.dataStore = dataStore;

		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		
		this.deltaTime = 0;
		this.previousTime = 0;
		
		this.scene = buildScene();
		this.renderer = buildRenderer(canvas, this.sizes);
		this.camera = buildCamera(this.scene, this.sizes, { x: 0, y: 1, z: 3 });
		
		
		this.controls = new Controls(this.camera, canvas);
		this.subjects = this.createSubjects(canvas, this.scene, this.camera);

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
		this.sizes = onWindowResize(this.renderer, this.camera);
	}

	/**
	 * Create the initial elements in the given Scene
	 * @param scene scene object the subjects will be created in
	 * @returns an array of subjects that have update functions
	 */
	public createSubjects(canvas: HTMLCanvasElement, scene: Scene, camera: PerspectiveCamera): IUpdates[] {
		return [
			this.controls
		];
	}
};

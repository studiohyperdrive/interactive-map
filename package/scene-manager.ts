import { AnimationClip, AnimationMixer, Clock, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";

import { buildScene, buildRenderer, buildCamera, buildClock, buildRaycaster, buildAnimationMixer } from "./utils/build";
import { onWindowResize } from "./utils/event";

import InteractiveMap from './subjects/interactive-map/interactive-map';
import GlobalIllumination from './subjects/global-illumination/global-illumination';
import Controls from "./subjects/controls/controls";

import { IAnimationConfig, IBindingConfig, IManager, ISize, IUpdates } from "./types";
import DataStore from "./data-store/data-store";

export default class SceneManager implements IManager {
	private dataStore: DataStore;
	public plugins: any[];

	public sizes: ISize;

	public animationConfig: IAnimationConfig[];

	public scene: Scene;
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera;
	public raycaster: Raycaster;
	public mixer: AnimationMixer;
	public mouse?: Vector2;

	public controls: Controls;
	public subjects: IUpdates[] = [];
	
	public clock: Clock;
	public deltaTime: number;
	public previousTime: number;

	constructor(canvas: HTMLCanvasElement, animation: IAnimationConfig[] = [], dataStore: DataStore, plugins: any[]) {
		this.dataStore = dataStore;

		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		
		this.animationConfig = animation;
		
		this.deltaTime = 0;
		this.previousTime = 0;
		
		this.scene = buildScene();
		this.renderer = buildRenderer(canvas, this.sizes);
		this.camera = buildCamera(this.scene, this.sizes, { x: 0, y: 1, z: 3 });
		
		this.clock = buildClock();
		this.raycaster = buildRaycaster();
		this.mixer = buildAnimationMixer(this.scene);
		
		this.controls = new Controls(this.camera, canvas);
		this.subjects = this.createSubjects(canvas, this.scene, this.camera, this.animationConfig);

		dataStore.set("scene", this.scene);
		dataStore.set("renderer", this.renderer);
		dataStore.set("camera", this.camera);
		dataStore.set("animationMixer", this.mixer);
		
		this.plugins = plugins.map(Plugin => new Plugin(dataStore));
	}

	//
	// Rendering
	//

	/**
	 * Render cycle function, updates every updateable subject.
	 */
	public update(): void {
		const elapsedTime = this.clock.getElapsedTime();
		this.deltaTime = elapsedTime - this.previousTime;
		this.previousTime = elapsedTime;

		for (let i = 0; i < this.subjects.length; i++) {
			this.subjects[i].update();
		}

		if (this.scene.animations) {
			this.mixer.update(this.deltaTime);
		}

		this.renderer.render(this.scene, this.camera);

		this.plugins.forEach(plugin => {
			plugin.update();
		});
	}

	/**
	 * Callback function responsible for keeping the sizes object up-to-date.
	 */
	public onWindowResizeCallback(): void {
		this.sizes = onWindowResize(this.renderer, this.camera);
	}

	/**
	 * Functions that fires when the model is fully loaded
	 * 
	 * @param animations an array of all animations in the scene
	 * @param animationConfig configuration bindings for autoplaying animations
	 */
	public onModelLoaded(animations: AnimationClip[], animationConfig: IAnimationConfig[]): void {
		this.startAnimations(animations, animationConfig);
	}

	/**
	 * Create the initial elements in the given Scene
	 * @param scene scene object the subjects will be created in
	 * @returns an array of subjects that have update functions
	 */
	public createSubjects(canvas: HTMLCanvasElement, scene: Scene, camera: PerspectiveCamera, animationConfig: IAnimationConfig[]): IUpdates[] {
		return [
			new InteractiveMap(scene, "/models/interactive-map_v2.8-draco.glb", (animations: AnimationClip[] = []) => this.onModelLoaded(animations, animationConfig)),
			new GlobalIllumination(scene),
			this.controls
		];
	}

	/**
	 * Function containing matching rules for click bindings, vaguely similar to QuerySelector.
	 * 
	 * @param mesh object to "bind" the click handler to.
	 * @param binding binding to "fire" when the matched object is "clicked".
	 * @returns whether the given binding applies to the given mesh.
	 */
	public isMatching(item: {name: string}, binding: IBindingConfig): boolean {
		switch (binding.matching) {
			case "partial":
				return item.name.indexOf(binding.name) > -1;

			case "exact":
			default:
				return item.name === binding.name;
		}
	}

	//
	// Animation
	//

	/**
	 * Function that matches the animation clips to their correct bindings
	 * 
	 * @param animations an array of all animations in the scene
	 * @param animationConfig configuration bindings for autoplaying animations
	 */
	public startAnimations(animations: AnimationClip[], animationConfig: IAnimationConfig[]) {
		animationConfig.forEach(animationData => {
			animations.forEach((animationClip, i) => {
				if (this.isMatching(animationClip, animationData)) {
					const action = this.mixer.clipAction(animationClip);
					action.loop = animationData.loop;
					animationData.startAnimation(action, i);
				}
			})
		});
	}
};

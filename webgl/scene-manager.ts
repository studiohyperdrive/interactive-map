import { AnimationClip, AnimationMixer, Camera, Clock, Intersection, LoopOnce, Mesh, OrthographicCamera, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";

import { buildScene, buildRenderer, buildOrthographicCamera, buildClock, buildMouse, buildRaycaster, buildAnimationMixer, buildPerspectiveCamera } from "./assets/utils/buildHelpers";
import { onWindowResize } from "./assets/utils/eventHelpers";
import { calculateCursorX, calculateCursorY, getFirstIntersectionObject } from "./assets/utils/generalHelpers";
import { flattenChildren } from "./assets/utils/gltfHelpers";

import InteractiveMap from './assets/scene-subjects/interactive-map/interactive-map';
import GlobalIllumination from './assets/scene-subjects/global-illumination/global-illumination';
import Controls from "./assets/scene-subjects/controls/controls";

import { IAnimate, IAnimationConfig, IBindingConfig, IClickBindingConfig, IHoverBindingConfig, IManager, IOrthographicCameraConfig, IPerspectiveCameraConfig, ISceneConfig, ISize, IUpdates } from "./types";

export default class SceneManager implements IManager {
	public sizes: ISize;

	public sceneConfig: ISceneConfig;

	public bindings: {
		click: IClickBindingConfig[],
		hover: IHoverBindingConfig[],
	} = { click: [], hover: [] };

	public animationConfig: IAnimationConfig[];

	public scene: Scene;
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera | OrthographicCamera;
	public raycaster: Raycaster;
	public mixer: AnimationMixer;
	public mouse?: Vector2;

	public controls: Controls;
	public subjects: IUpdates[] = [];
	public intersections: Intersection[] = [];
	public hovered: THREE.Mesh | null = null;
	
	public clock: Clock;
	public deltaTime: number;
	public previousTime: number;

	constructor(canvas: HTMLCanvasElement, sceneConfig: ISceneConfig, animation: IAnimationConfig[] = []) {
		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.sceneConfig = sceneConfig;

		this.animationConfig = animation;

		this.deltaTime = 0;
		this.previousTime = 0;

		this.scene = buildScene();
		this.renderer = buildRenderer(canvas, this.sizes);
		this.camera = this.sceneConfig.camera.type === "orthographic" 
			? buildOrthographicCamera(this.scene, this.sizes, this.sceneConfig.camera.config as IOrthographicCameraConfig) 
			: buildPerspectiveCamera(this.scene, this.sizes, this.sceneConfig.camera.config as IPerspectiveCameraConfig);
		this.clock = buildClock();
		this.raycaster = buildRaycaster();
		this.mixer = buildAnimationMixer(this.scene);

		this.controls = new Controls(this.camera, canvas, this.sceneConfig.controls);
		this.subjects = this.createSubjects(canvas, this.scene, this.camera, this.animationConfig);
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
	}

	/**
	 * Callback function responsible for keeping the sizes object up-to-date.
	 */
	public onWindowResizeCallback(): void {
		this.sizes = onWindowResize(this.renderer, this.camera, this.sceneConfig.camera.config);
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
	public createSubjects(canvas: HTMLCanvasElement, scene: Scene, camera: Camera, animationConfig: IAnimationConfig[]): IUpdates[] {
		return [
			new InteractiveMap(scene, "/models/interactive-map_v2.8-draco.glb", (animations: AnimationClip[] = []) => this.onModelLoaded(animations, animationConfig)),
			new GlobalIllumination(scene),
			this.controls
		];
	}



	//
	// Click and hover Events
	//

	/**
	 * Function used to create the initial Vector2 object for the mouse and keep it in sync.
	 * 
	 * @param e OnMouseMove event.
	 */
	public updateMouse(e: MouseEvent): void {
		if (this.mouse === undefined) {
			this.mouse = buildMouse(e);
		} else {
			this.mouse.x = calculateCursorX(e);
			this.mouse.y = calculateCursorY(e);
		}
	}

	/**
	 * Function used to instruct the raycaster to update the list of intersecting objects.
	 * Intersections are only tracked if they"re a Mesh and have a corresponding binding.
	 */
	public updateIntersections(): void {
		if (this.mouse === undefined) {
			return
		};

		this.raycaster.setFromCamera(this.mouse, this.camera);

		const children = (flattenChildren(this.scene.children).filter(c => {
			return c instanceof Mesh;
		}) as Mesh[]);

		this.intersections = this.raycaster.intersectObjects(children);
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

	/**
	 * Function firing the onClick handlers defined in the click bindings.
	 * 
	 * @param e event fired by DOM.
	 */
	public handleClick(e: MouseEvent): void {
		if (!getFirstIntersectionObject(this.intersections)) {
			return
		};

		const clicked = getFirstIntersectionObject(this.intersections);

		if (clicked instanceof Mesh) {
			this.bindings.click.forEach(binding => {
				if (this.isMatching(clicked, binding)) {
					binding.onClick(clicked);
					this.handleBindingAnimation(binding, (animation: AnimationClip, animationBinding: IAnimate) => {
						const action = this.mixer.clipAction(animation);
						action.loop = animationBinding.loop;
						if (!action.isRunning()) {
							action.reset().play();
						}
					});
				}
			});
		}
	}

	/**
	 * Function that updates every frame and fires the onHover handlers defined in the hover bindings
	 */
	public handleHover(e: MouseEvent): void {
		const previous = this.hovered;
		const current = getFirstIntersectionObject(this.intersections);

		if (previous === current) {
			return
		}

		if (previous instanceof Mesh) {
			this.bindings.hover.forEach(binding => {
				if (this.isMatching(previous, binding)) {
					binding.onHoverEnd(previous);
					this.handleBindingAnimation(binding, (animation: AnimationClip, animationBinding: IAnimate) => {
						const action = this.mixer.clipAction(animation);
						action.loop = LoopOnce;
					});
				}
			});
		}

		if (current instanceof Mesh) {
			this.bindings.hover.forEach(binding => {
				if (this.isMatching(current, binding)) {
					binding.onHoverStart(current);
					this.handleBindingAnimation(binding, (animation: AnimationClip, animationBinding: IAnimate) => {
						const action = this.mixer.clipAction(animation);
						action.loop = animationBinding.loop;
						if (!action.isRunning()) {
							action.reset().play();
						}
					});
				}
			});
		}

		this.hovered = (current as Mesh);
	}

	/**
	 * Register click bindings for the managed scene
	 * 
	 * @param bindings The bindings that should be accounted for during render cycles.
	 */
	public setClickBindings(bindings: IClickBindingConfig[]) {
		this.bindings.click = bindings;
	}

	/**
	 * Register hover bindings for the managed scene
	 * 
	 * @param bindings The bindings that should be accounted for during render cycles.
	 */
	public setHoverBindings(bindings: IHoverBindingConfig[]) {
		this.bindings.hover = bindings;
	}

	//
	// Animation
	//

	public handleBindingAnimation(binding: IClickBindingConfig | IHoverBindingConfig, callback: (animation: AnimationClip, animationBinding: IAnimate) => void) {
		if (binding.animate) {
			binding.animate.forEach((animationBinding) => {
				this.scene.animations.forEach(animation => {
					if (this.isMatching(animation, animationBinding)) {
						callback(animation, animationBinding);
					}
				});
			});
		}
	}

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

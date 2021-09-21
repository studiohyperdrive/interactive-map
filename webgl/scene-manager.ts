import { AnimationClip, AnimationMixer, Clock, Intersection, LoopOnce, Mesh, Object3D, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";

import { buildScene, buildRenderer, buildCamera, buildClock, buildMouse, buildRaycaster, buildAnimationMixer } from "./assets/utils/buildHelpers";
import { onWindowResize } from "./assets/utils/eventHelpers";
import { calculateCursorX, calculateCursorY, getFirstIntersectionObject } from "./assets/utils/generalHelpers";
import { flattenChildren } from "./assets/utils/gltfHelpers";

import InteractiveMap from './assets/scene-subjects/interactive-map/interactive-map';
import GlobalIllumination from './assets/scene-subjects/global-illumination/global-illumination';
import Controls from "./assets/scene-subjects/controls/controls";

import { IAnimationBindingConfig, IBindingConfig, IClickBindingConfig, IHoverBindingConfig, IManager, ISize, IUpdates } from "./types";
import animation from "../bindings/animation";

export default class SceneManager implements IManager {
	public sizes: ISize;

	public bindings: {
		click: IClickBindingConfig[],
		hover: IHoverBindingConfig[],
		animation: IAnimationBindingConfig[],
	} = { click: [], hover: [], animation: [] };

	public scene: Scene;
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera;
	public raycaster: Raycaster;
	public mixer: AnimationMixer;
	public mouse?: Vector2;

	public subjects: IUpdates[] = [];
	public intersections: Intersection[] = [];
	public currentHover: THREE.Mesh | null = null;
	
	public clock: Clock;
	public deltaTime: number;
	public previousTime: number;

	constructor(canvas: HTMLCanvasElement) {
		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.deltaTime = 0;
		this.previousTime = 0;

		this.scene = buildScene();
		this.renderer = buildRenderer(canvas, this.sizes);
		this.camera = buildCamera(this.scene, this.sizes, { x: 0, y: 1, z: 3 });
		this.clock = buildClock();
		this.raycaster = buildRaycaster();
		this.mixer = buildAnimationMixer(this.scene);

		this.subjects = this.createSubjects(canvas, this.scene, this.camera, this.clock);
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
		this.sizes = onWindowResize(this.renderer, this.camera);
	}

	/**
	 * Create the initial elements in the given Scene
	 * @param scene scene object the subjects will be created in
	 * @returns an array of subjects that have update functions
	 */
	public createSubjects(canvas: HTMLCanvasElement, scene: Scene, camera: PerspectiveCamera, clock: Clock): IUpdates[] {
		return [
			new InteractiveMap(scene, "/models/interactive-map_v2.7-draco.glb"),
			new GlobalIllumination(scene),
			new Controls(camera, canvas),
		];
	}

	//
	// Click Events
	//

	/**
	 * Function used to create the initial Vector2 object for the mouse and keep it in sync. Fires debounced.
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
		if (this.mouse === undefined) return;

		this.raycaster.setFromCamera(this.mouse, this.camera);

		const children = (flattenChildren(this.scene.children).filter(c => {
			return c instanceof Mesh;
		}) as Mesh[]).filter(mesh => {
			return (
				this.bindings.click.some(binding => {
					return this.isMatching(mesh, binding);
				})
			||
				this.bindings.hover.some(binding => {
					return this.isMatching(mesh, binding);
				})
			||
				this.bindings.animation.some(binding => {
					return binding.mesh.some(triggerMesh => {
						return this.isMatching(mesh, triggerMesh);
					})
				})
			);
		});

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

	public hasAnimation(item: Mesh, binding: IAnimationBindingConfig, type: "click" | "hover") {
		return binding.trigger.includes(type) && binding.mesh.some(mesh => this.isMatching(item, mesh))
	}

	/**
	 * Function firing the onClick handlers defined in the click bindings.
	 * 
	 * @param e event fired by DOM.
	 */
	public handleClick(e: MouseEvent): void {
		if (!getFirstIntersectionObject(this.intersections)) return;

		const clicked = getFirstIntersectionObject(this.intersections);

		if (clicked instanceof Mesh) {
			this.bindings.click.forEach(binding => {
				if (this.isMatching(clicked, binding)) {
					binding.onClick(clicked);
				}
			});
		}

		this.handleClickAnimation();
	}

	/**
	 * Function that updates every frame and fires the onHover handlers defined in the click bindings
	 *
	 */

	public updateHover(): void {		
		const prevHover = this.currentHover;
		const currentHover = getFirstIntersectionObject(this.intersections);
		
		if (prevHover === currentHover) {
			return
		}

		if (currentHover instanceof Mesh) {
			this.bindings.hover.forEach(hover => {
				if (this.isMatching(currentHover, hover)) {		
					hover.onHoverStart(currentHover);
				}
			});
		}

		if (prevHover instanceof Mesh) {
			this.bindings.hover.forEach(hover => {
				if (this.isMatching(prevHover, hover)) {					
					hover.onHoverEnd(prevHover);
				}
			});
		}
		this.updateHoverAnimation(currentHover, prevHover);

		this.currentHover = (currentHover as Mesh);
	}

	/**
	 * Function firing the onClick animations defined in the animation bindings.
	 * 
	 */
	public handleClickAnimation(): void {
		if (!getFirstIntersectionObject(this.intersections)) return;

		const clicked = getFirstIntersectionObject(this.intersections);

		if (clicked instanceof Mesh) {
			this.bindings.animation.forEach(binding => {					
				if (this.hasAnimation(clicked, binding, "click")) {
					const animations = this.scene.animations.filter(animation => this.isMatching(animation, binding));
					animations.forEach(animation => {
						const action = this.mixer.clipAction(animation);
						action.loop = binding.loop;
						action.play();
					})
				}
			});
		}
	}

	/**
	 * Function firing the hover animations defined in the animation bindings.
	 * 
	 */
	public updateHoverAnimation(currentHover: Mesh | Object3D | null, prevHover: Mesh | Object3D | null) {
		if (currentHover instanceof Mesh) {
			this.bindings.animation.forEach(binding => {		
				if (this.hasAnimation(currentHover, binding, "hover")) {
					const animations = this.scene.animations.filter(animation => this.isMatching(animation, binding));
					animations.forEach(animation => {
						const action = this.mixer.clipAction(animation);
						action.loop = binding.loop;
						action.play();
					})
				}
			});
		}

		if (prevHover instanceof Mesh) {
			this.bindings.animation.forEach(binding => {		
				if (this.hasAnimation(prevHover, binding, "hover")) {
					const animations = this.scene.animations.filter(animation => this.isMatching(animation, binding));
					animations.forEach(animation => {
						const action = this.mixer.clipAction(animation);
						action.loop = LoopOnce;
					})
				}
			});
		}
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

	/**
	 * Register animation bindings for the managed scene
	 * 
	 * @param bindings The bindings that should be accounted for during render cycles.
	 */
	 public setAnimationBindings(bindings: IAnimationBindingConfig[]) {
		this.bindings.animation = bindings;
	}
};
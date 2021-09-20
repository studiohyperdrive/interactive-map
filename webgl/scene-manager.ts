import { Clock, Intersection, Mesh, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";

import { buildScene, buildRenderer, buildCamera, buildClock, buildMouse, buildRaycaster } from "./assets/utils/buildHelpers";
import { onWindowResize } from "./assets/utils/eventHelpers";
import { calculateCursorX, calculateCursorY, getFirstIntersectionObject } from "./assets/utils/generalHelpers";
import { flattenChildren } from "./assets/utils/gltfHelpers";

import InteractiveMap from './assets/scene-subjects/interactive-map/interactive-map';
import GlobalIllumination from './assets/scene-subjects/global-illumination/global-illumination';
import Controls from "./assets/scene-subjects/controls/controls";

import { IBindingConfig, IClickBindingConfig, IHoverBindingConfig, IManager, ISize, IUpdates } from "./types";

export default class SceneManager implements IManager {
	public sizes: ISize;

	public bindings: {
		click: IClickBindingConfig[],
		hover: IHoverBindingConfig[],
	} = { click: [], hover: [] };

	public scene: Scene;
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera;
	public clock: Clock;
	public raycaster: Raycaster;
	public mouse?: Vector2;

	public subjects: IUpdates[] = [];
	public intersections: Intersection[] = [];
	public currentHover: THREE.Mesh | null = null;

	constructor(canvas: HTMLCanvasElement) {
		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.scene = buildScene();
		this.renderer = buildRenderer(canvas, this.sizes);
		this.camera = buildCamera(this.scene, this.sizes, { x: 0, y: 1, z: 3 });
		this.clock = buildClock();
		this.raycaster = buildRaycaster();

		this.subjects = this.createSubjects(canvas, this.scene, this.camera);

		console.info("SceneManager", this.scene);
	}

	//
	// Rendering
	//

	/**
	 * Render cycle function, updates every updateable subject.
	 */
	public update(): void {
		for (let i = 0; i < this.subjects.length; i++) {
			this.subjects[i].update();
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
	public createSubjects(canvas: HTMLCanvasElement, scene: THREE.Scene, camera: THREE.PerspectiveCamera): IUpdates[] {
		return [
			new InteractiveMap(scene, "/models/interactive-map_v1.glb"),
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
	public isMatching(mesh: Mesh, binding: IBindingConfig): boolean {
		switch (binding.matching) {
			case "partial":
				return mesh.name.indexOf(binding.name) > -1;

			case "exact":
			default:
				return mesh.name === binding.name;
		}
	}

	/**
	 * Function firing the onClick handlers defined in the click bindings.
	 * 
	 * @param e event fired by DOM.
	 */
	public handleClick(e: MouseEvent): void {
		if (!getFirstIntersectionObject(this.intersections)) return;

		const clicked = this.intersections[0].object;

		if (clicked instanceof Mesh) {
			this.bindings.click.forEach(binding => {
				if (this.isMatching(clicked, binding)) {
					binding.onClick(clicked);
				}
			});
		}
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

		this.currentHover = (currentHover as Mesh);
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
};
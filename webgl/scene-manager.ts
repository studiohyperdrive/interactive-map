import { Clock, Intersection, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";

import { buildScene, buildRenderer, buildCamera, buildClock, buildMouse, calculateCursorX, calculateCursorY, buildRaycaster } from "./assets/utils/buildHelpers";
import { onWindowResize } from "./assets/utils/eventHelpers";

import InteractiveMap from './assets/scene-subjects/interactive-map/interactive-map';
import GlobalIllumination from './assets/scene-subjects/global-illumination/global-illumination';

import { IClickBindingConfig, IManager, ISize, IUpdates } from "./types";
import { flattenChildren } from "./assets/utils/gltfHelpers";

export default class SceneManager implements IManager {
	public sizes: ISize;

	public bindings: {
		click: IClickBindingConfig[]
	}

	public scene: Scene;
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera;
	public clock: Clock;
	public raycaster: Raycaster;
	public mouse?: Vector2;

	public subjects: IUpdates[] = [];
	public intersections: Intersection[] = [];

	constructor(canvas: HTMLCanvasElement) {
		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.bindings = {
			click: [
				{
					name: 'skyscraper',
					matching: 'partial',
					onClick: (mesh: Mesh) => {
						const random = new MeshBasicMaterial();
						random.color.setHex(Math.random() * 0xffffff);

						mesh.material = random;
					}
				}
			]
		};

		this.scene = buildScene();
		this.renderer = buildRenderer(canvas, this.sizes);
		this.camera = buildCamera(this.scene, this.sizes, { x: 0, y: 1, z: 3 });
		this.clock = buildClock();
		this.raycaster = buildRaycaster();

		this.subjects = this.createSubjects(this.scene);
	}

	public update(): void {
		for (let i = 0; i < this.subjects.length; i++) {
			this.subjects[i].update();
		}

		this.renderer.render(this.scene, this.camera);
	}

	public onWindowResizeCallback(): void {
		this.sizes = onWindowResize(this.renderer, this.camera);
	}

	public createSubjects(scene: THREE.Scene): IUpdates[] {
		return [
			new InteractiveMap(scene, '/models/interactive-map_v1.glb', this.bindings.click),
			new GlobalIllumination(scene),
		];
	}

	public initMouse(e: MouseEvent): void {
		this.mouse = buildMouse(e);
	}

	public updateMouse(e: MouseEvent): void {
		if (this.mouse === undefined) {
			this.initMouse(e);
		} else {
			this.mouse.x = calculateCursorX(e);
			this.mouse.y = calculateCursorY(e);
		}
	}

	public updateIntersections(): void {
		if (this.mouse === undefined) return;

		this.raycaster.setFromCamera(this.mouse, this.camera);

		const children = (flattenChildren(this.scene.children).filter(c => {
			return c instanceof Mesh;
		}) as Mesh[]).filter(mesh => {
			return this.bindings.click.some(binding => {
				return this.isMatching(mesh, binding);
			})
		});

		this.intersections = this.raycaster.intersectObjects(children);
	}

    public isMatching(mesh: Mesh, binding: IClickBindingConfig): boolean {
		switch (binding.matching) {
            case 'partial':
                return mesh.name.indexOf(binding.name) > -1;

            case 'exact': 
            default:
                return mesh.name === binding.name;
        }
    }
};
import { buildScene, buildRenderer, buildCamera, buildClock } from "./assets/utils/buildHelpers";
import { onWindowResize } from "./assets/utils/eventHelpers";

import InteractiveMap from './assets/scene-subjects/interactive-map/interactive-map';
import GlobalIllumination from './assets/scene-subjects/global-illumination/global-illumination';
import MouseControls from "./assets/scene-subjects/controls/mouse-controls/mouse-controls";
import RotateControls from "./assets/scene-subjects/controls/rotate-controls/rotate-controls";

import { IManager, ISize, IUpdates } from "./types";

export default class SceneManager implements IManager {
	public sizes: ISize;

	public scene: THREE.Scene;
	public renderer: THREE.WebGLRenderer;
	public camera: THREE.PerspectiveCamera;
	public clock: THREE.Clock;

	public subjects: IUpdates[] = [];

	constructor(canvas: HTMLCanvasElement) {
		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.scene = buildScene();
		this.renderer = buildRenderer(canvas, this.sizes);
		this.camera = buildCamera(this.scene, this.sizes, { x: 0, y: 1, z: 3 });
		this.clock = buildClock();

		this.subjects = this.createSubjects(canvas, this.scene, this.camera);
	}

	public update(): void {
		for (let i = 0; i < this.subjects.length; i++) {
			this.subjects[i].update();
		}

		this.renderer.render(this.scene, this.camera);
	}

	public onWindowResizeCallback(): void {
		onWindowResize(this.renderer, this.camera, this.sizes);
	}

	public createSubjects(canvas: HTMLCanvasElement, scene: THREE.Scene, camera: THREE.PerspectiveCamera): IUpdates[] {
		return [
			new InteractiveMap(scene, '/models/interactive-map_v1.glb'),
			new GlobalIllumination(scene),
			new MouseControls(camera, canvas),
			new RotateControls(camera),
		];
	}
};
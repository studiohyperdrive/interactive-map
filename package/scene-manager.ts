import { PerspectiveCamera, Scene, WebGLRenderer } from "three";

import { buildScene, buildRenderer, buildCamera } from "./utils/build";

import { IManager, ISize } from "./types";
import DataStore from "./data-store/data-store";

export default class SceneManager implements IManager {
	private dataStore: DataStore;
	
	public sizes: ISize;
	
	public scene: Scene;
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera;

	public plugins: any[];
	
	constructor(canvas: HTMLCanvasElement, dataStore: DataStore, plugins: any[]) {
		this.dataStore = dataStore;

		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		
		this.scene = buildScene();
		this.renderer = buildRenderer(canvas, this.sizes);
		this.camera = buildCamera(this.scene, this.sizes, { x: 0, y: 1, z: 3 });

		dataStore.set("canvas", canvas);
		dataStore.set("scene", this.scene);
		dataStore.set("renderer", this.renderer);
		dataStore.set("camera", this.camera);
		dataStore.set("sizes", this.sizes);
		
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

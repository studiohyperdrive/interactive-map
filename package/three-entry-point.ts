import SceneManager from "./scene-manager";
import DataStore from "./data-store/data-store";

import { IEntryPoint, ISceneConfig } from "./types";
import { getCameraLerpSynchroniserPlugin } from "./plugins/camera-lerp-synchroniser-plugin/camera-lerp-synchroniser-plugin.helpers";
import { getCameraLerpPlugin } from "./plugins/camera-lerp-plugin/camera-lerp-plugin.helpers";
import { getRaycasterPlugin } from "./plugins/raycaster-plugin/raycaster-plugin.helpers";
import { getHoverPlugin } from "./plugins/hover-plugin/hover-plugin.helpers";

export default class ThreeEntryPoint implements IEntryPoint {
	private dataStore: DataStore;

	public canvas: HTMLCanvasElement;
	public manager: SceneManager;
	public sceneConfig: ISceneConfig;
	public plugins: any[];
	public interactive: boolean = true;

	constructor(canvas: HTMLCanvasElement, sceneConfig: ISceneConfig, eventPlugins: any[], scenePlugins: any[]) {
		this.dataStore = new DataStore;

		this.canvas = canvas;
		this.sceneConfig = sceneConfig;
		this.manager = new SceneManager(canvas, sceneConfig, this.dataStore, scenePlugins);
		this.plugins = eventPlugins.map(Plugin => new Plugin(this.dataStore));

		this.initCameraLerpSynchroniserPlugin(
			this.plugins,
			this.manager.plugins
		);

		this.bindEventListeners();
		this.render();
	}

	public bindEventListeners(): void {
		this.interactive = true;

		this.plugins.forEach(plugin => {
			plugin.bindEventListener();
		});
	}

	public unbindEventListeners(): void {
		this.interactive = false;

		this.plugins.forEach(plugin => {
			plugin.unbindEventListener();
		});
	}

	public render(): void {
		requestAnimationFrame(() => { this.render() });
		this.manager.update();
	};

	private initCameraLerpSynchroniserPlugin(eventPlugins: any[], scenePlugins: any[]): void {
		const synchroniser = getCameraLerpSynchroniserPlugin(scenePlugins);

		if (synchroniser) {
			const lerp = getCameraLerpPlugin(scenePlugins);
			const raycaster = getRaycasterPlugin(eventPlugins);

			// The synchroniser needs lerp and raycaster at minimum to provide value.
			if (lerp && raycaster) {
				synchroniser.lerp = lerp;
				synchroniser.raycaster = raycaster;
				synchroniser.hover = getHoverPlugin(eventPlugins);
			}
		}
	}
};
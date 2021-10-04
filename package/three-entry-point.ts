import SceneManager from "./scene-manager";
import DataStore from "./data-store/data-store";

import { ISceneConfig } from "./types";

export default class ThreeEntryPoint {
	public dataStore: DataStore;

	public canvas: HTMLCanvasElement;
	public manager: SceneManager;
	public sceneConfig: ISceneConfig;
	public plugins: any[];
	public interactive: boolean = true;

	constructor(canvas: HTMLCanvasElement, sceneConfig: ISceneConfig, plugins: any[], scenePlugins: any[]) {
		this.dataStore = new DataStore;

		this.canvas = canvas;
		this.sceneConfig = sceneConfig;
		this.manager = new SceneManager(canvas, sceneConfig, this.dataStore, scenePlugins);
		this.plugins = plugins.map(Plugin => new Plugin(this.dataStore));

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
};
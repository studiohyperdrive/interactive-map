import SceneManager from "./scene-manager";
import DataStore from "./data-store/data-store";

import { IAnimationConfig, IClickBindingConfig, IHoverBindingConfig, IEventPlugin, IScenePlugin } from "./types";

export default class ThreeEntryPoint {
	public dataStore: DataStore;

	public canvas;
	public manager;
	public plugins: any[];
	public interactive: boolean = true;

	constructor(canvas: HTMLCanvasElement, plugins: any[], scenePlugins: any[]) {
		this.dataStore = new DataStore;

		this.canvas = canvas;
		this.manager = new SceneManager(canvas, this.dataStore, scenePlugins);
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
import SceneManager from "./scene-manager";
import DataStore from "./data-store/data-store";

import { IAnimationConfig, IClickBindingConfig, IHoverBindingConfig, IEventPlugin, IScenePlugin } from "./types";

export default class ThreeEntryPoint {
	public plugins: any[];
	public dataStore: DataStore;

	public canvas;
	public manager;

	public listeners;
	public click;
	public hover;

	public interactive: boolean = true;

	constructor(canvas: HTMLCanvasElement, click: IClickBindingConfig[] = [], hover: IHoverBindingConfig[] = [], animation: IAnimationConfig[] = [], plugins: any[], scenePlugins: any[]) {
		this.dataStore = new DataStore;

		this.canvas = canvas;
		this.manager = new SceneManager(canvas, animation, this.dataStore, scenePlugins);
		
		this.plugins = plugins.map(Plugin => new Plugin(this.dataStore));

		this.listeners = {
			onresize: () => {
				this.resizeCanvas()
			},
		}

		this.click = click;
		this.hover = hover;

		this.bindEventListeners(click, hover);
		this.render();
	}

	public bindEventListeners(click: IClickBindingConfig[], hover: IHoverBindingConfig[]): void {
		window.addEventListener("resize", this.listeners.onresize);

		this.resizeCanvas();

		this.interactive = true;

		this.plugins.forEach(plugin => {			
			plugin.bindEventListener();
		});
	}

	public unbindEventListeners(): void {
		window.removeEventListener("resize", this.listeners.onresize);

		this.resizeCanvas();

		this.interactive = false;

		this.plugins.forEach(plugin => {
			plugin.unbindEventListener();
		});
	}

	public resizeCanvas(): void {
		this.manager.onWindowResizeCallback();
	}

	public render(): void {
		requestAnimationFrame(() => { this.render() });
		this.manager.update();
	};
};
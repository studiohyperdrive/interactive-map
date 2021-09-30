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

	constructor(canvas: HTMLCanvasElement, click: IClickBindingConfig[] = [], hover: IHoverBindingConfig[] = [], animation: IAnimationConfig[] = [], plugins: any[], dataStore: DataStore, scenePlugins: any[]) {
		this.plugins = plugins.map(Plugin => new Plugin(dataStore));
		this.dataStore = dataStore;

		this.canvas = canvas;
		this.manager = new SceneManager(canvas, animation, dataStore, scenePlugins);

		this.listeners = {
			onresize: () => {
				this.resizeCanvas()
			},
			// onmousemove: (e: MouseEvent) => {
			// 	this.manager.updateMouse(e);
			// 	this.manager.updateIntersections();
			// 	this.manager.handleHover(e);
			// },
			// onclick: (e: MouseEvent) => {
			// 	this.manager.updateMouse(e);
			// 	this.manager.updateIntersections();
			// 	this.manager.handleClick(e);
			// }
		}

		this.click = click;
		this.hover = hover;

		this.bindEventListeners(click, hover);
		this.render();
	}

	public bindEventListeners(click: IClickBindingConfig[], hover: IHoverBindingConfig[]): void {
		window.addEventListener("resize", this.listeners.onresize);
		// window.addEventListener("mousemove", this.listeners.onmousemove);
		// window.addEventListener("click", this.listeners.onclick);

		this.manager.setClickBindings(click);
		this.manager.setHoverBindings(hover);

		this.resizeCanvas();

		this.interactive = true;

		this.plugins.forEach(plugin => {			
			plugin.bindEventListener();
		});
	}

	public unbindEventListeners(): void {
		window.removeEventListener("resize", this.listeners.onresize);
		// window.removeEventListener("mousemove", this.listeners.onmousemove);
		// window.removeEventListener("click", this.listeners.onclick);

		this.manager.setClickBindings([]);
		this.manager.setHoverBindings([]);

		this.resizeCanvas();

		this.interactive = false;

		this.plugins.forEach(plugin => {
			plugin.unbindEventListener();
		});
	}

	public resizeCanvas(): void {
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		this.manager.onWindowResizeCallback();
	}

	public render(): void {
		requestAnimationFrame(() => { this.render() });
		this.manager.update();
	};
};
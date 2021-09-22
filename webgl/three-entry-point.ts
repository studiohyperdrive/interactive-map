import { debounce } from "./assets/utils/eventHelpers";
import SceneManager from "./scene-manager";

import { IClickBindingConfig, IHoverBindingConfig } from "./types";

export default class ThreeEntryPoint {
	public canvas;
	public manager;

	public listeners;
	public click;
	public hover;

	public interactive: boolean = true;

	constructor(canvas: HTMLCanvasElement, click: IClickBindingConfig[] = [], hover: IHoverBindingConfig[] = []) {
		this.canvas = canvas;
		this.manager = new SceneManager(canvas);

		this.listeners = {
			onresize: () => {
				this.resizeCanvas()
			},
			onmousemove: debounce((e: MouseEvent) => {
				this.manager.updateMouse(e);
				this.manager.updateIntersections();
				this.manager.handleHover(e);
			}, 8),
			onclick: (e: MouseEvent) => {
				this.manager.updateMouse(e);
				this.manager.updateIntersections();
				this.manager.handleClick(e);
			}
		}

		this.click = click;
		this.hover = hover;

		this.bindEventListeners(click, hover);
		this.render();
	}

	public bindEventListeners(click: IClickBindingConfig[], hover: IHoverBindingConfig[]): void {
		window.addEventListener("resize", this.listeners.onresize);
		window.addEventListener("mousemove", this.listeners.onmousemove);
		window.addEventListener("click", this.listeners.onclick);

		this.manager.setClickBindings(click);
		this.manager.setHoverBindings(hover);

		this.resizeCanvas();

		this.interactive = true;
	}

	public unbindEventListeners(): void {
		window.removeEventListener("resize", this.listeners.onresize);
		window.removeEventListener("mousemove", this.listeners.onmousemove);
		window.removeEventListener("click", this.listeners.onclick);

		this.manager.setClickBindings([]);
		this.manager.setHoverBindings([]);

		this.resizeCanvas();

		this.interactive = false;
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
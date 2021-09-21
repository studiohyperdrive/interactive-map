import { debounce } from "./assets/utils/eventHelpers";
import SceneManager from "./scene-manager";

import { IClickBindingConfig, IHoverBindingConfig } from "./types";

export default class ThreeEntryPoint {
	public canvas;
	public manager;

	constructor(canvas: HTMLCanvasElement, click: IClickBindingConfig[] = [], hover: IHoverBindingConfig[] = []) {
		this.canvas = canvas;
		this.manager = new SceneManager(canvas);

		this.bindEventListeners(click, hover);
		this.render();
	}

	public bindEventListeners(click: IClickBindingConfig[], hover: IHoverBindingConfig[]): void {
		window.onresize = () => {
			this.resizeCanvas()
		};

		window.onmousemove = debounce((e: MouseEvent) => {
			this.manager.updateMouse(e);
			this.manager.updateIntersections();
			this.manager.handleHover(e);
		}, 12);

		window.onclick = (e: MouseEvent) => {
			this.manager.updateMouse(e);
			this.manager.updateIntersections();
			this.manager.handleClick(e);
		};

		this.resizeCanvas();
		this.manager.setClickBindings(click);
		this.manager.setHoverBindings(hover);
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
import animation from "../bindings/animation";
import { debounce } from "./assets/utils/eventHelpers";
import SceneManager from "./scene-manager";

import { IAnimationBindingConfig, IClickBindingConfig, IHoverBindingConfig } from "./types";

export default class ThreeEntryPoint {
	public canvas;
	public manager;

	constructor(canvas: HTMLCanvasElement, click: IClickBindingConfig[] = [], hover: IHoverBindingConfig[] = [], animation: IAnimationBindingConfig[]) {
		this.canvas = canvas;
		this.manager = new SceneManager(canvas);

		this.bindEventListeners(click, hover, animation);
		this.render();
	}

	public bindEventListeners(click: IClickBindingConfig[], hover: IHoverBindingConfig[], animation: IAnimationBindingConfig[]): void {
		window.onresize = () => {
			this.resizeCanvas()
		};

		window.onmousemove = debounce((e: MouseEvent) => {
			this.manager.updateMouse(e);
			this.manager.updateIntersections();
			this.manager.updateHover();
		}, 12);

		window.onclick = (e: MouseEvent) => {
			this.manager.updateMouse(e);
			this.manager.updateIntersections();
			this.manager.handleClick(e);
		};

		this.resizeCanvas();
		this.manager.setClickBindings(click);
		this.manager.setHoverBindings(hover);
		this.manager.setAnimationBindings(animation);
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
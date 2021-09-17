import { debounce } from "./assets/utils/eventHelpers";
import SceneManager from "./scene-manager";

import { IClickBindingConfig } from "./types";

export default class ThreeEntryPoint {
	public canvas;
	public manager;

	constructor(canvas: HTMLCanvasElement, click: IClickBindingConfig[] = []) {
		this.canvas = canvas;
		this.manager = new SceneManager(canvas);

		this.bindEventListeners(click);
		this.render();
	}

	public bindEventListeners(click: IClickBindingConfig[]): void {
		window.onresize = () => {
			this.resizeCanvas()
		};

		window.onmousemove = debounce((e: MouseEvent) => {
			this.manager.updateMouse(e);
			this.manager.updateIntersections();
		}, 12);

		window.onclick = (e: MouseEvent) => {
			this.manager.updateMouse(e);
			this.manager.updateIntersections();
			this.manager.handleClick(e);
		};

		this.resizeCanvas();
		this.manager.setClickBindings(click);
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
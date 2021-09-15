import { Mesh } from 'three';
import { debounce } from './assets/utils/eventHelpers';
import SceneManager from './scene-manager';

export default class ThreeEntryPoint {
	public canvas;
	public manager;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.manager = new SceneManager(canvas);

		this.bindEventListeners();
		this.render();
	}

	public bindEventListeners(): void {
		window.onresize = () => {this.resizeCanvas()};
		window.onmousemove = debounce((e: MouseEvent) => {
			this.manager.updateMouse(e);
			this.manager.updateIntersections();
		}, 12);
		window.onclick = (e: MouseEvent) => {
			this.manager.updateMouse(e);
			this.manager.updateIntersections();

			const clicked = this.manager.intersections[0].object;
			
			if (clicked instanceof Mesh) {
				this.manager.bindings.click.filter(binding => {
					if (this.manager.isMatching(clicked, binding)) {
						binding.onClick(clicked);
					}
				});
			}
		}

		this.resizeCanvas();
	}

	public resizeCanvas(): void {
		this.canvas.style.width = '100%';
		this.canvas.style.height = '100%';
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		this.manager.onWindowResizeCallback();
	}

	public render(): void {
		requestAnimationFrame(() => { this.render() });
		this.manager.update();
	};
};
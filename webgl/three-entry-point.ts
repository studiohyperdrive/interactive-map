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
		window.onresize = this.resizeCanvas;
		
		this.resizeCanvas();
	}

	public resizeCanvas(): void {		
		this.canvas.style.width = '100%';
		this.canvas.style.height= '100%';
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		this.manager.onWindowResizeCallback();
	}

	public render(): void {
		requestAnimationFrame(() => {this.render()});
		this.manager.update();
	};
};
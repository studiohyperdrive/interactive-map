import SceneManager from './scene-manager';

const threeEntryPoint = (canvas: HTMLCanvasElement): void => {
	const sceneManager = new SceneManager(canvas);

	const bindEventListeners = () => {
		window.onresize = resizeCanvas;
		
		resizeCanvas();
	}

	const resizeCanvas = () => {		
		canvas.style.width = '100%';
		canvas.style.height= '100%';
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		sceneManager.onWindowResizeCallback();
	}

	const render = (): void => {
		requestAnimationFrame(render);
		sceneManager.update();
	};

	bindEventListeners();
	render();
};

export default threeEntryPoint;
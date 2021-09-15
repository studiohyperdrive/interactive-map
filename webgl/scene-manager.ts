import { Sizes, SceneManagerTypes } from './types';
import { buildScene, buildRenderer, buildCamera, buildClock } from "./assets/utils/buildHelpers";
import { onWindowResize } from "./assets/utils/eventHelpers";
import InteractiveMap from './assets/scene-subjects/interactive-map/interactive-map';
import GlobalIllumination from './assets/scene-subjects/global-illumination/global-illumination';
import Controls from './assets/scene-subjects/controls/controls';

const SceneManager = (canvas: HTMLCanvasElement): SceneManagerTypes  => {
	// Constants
		const sizes: Sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	};
	
	// Subjects
	const createSceneSubjects = (): any[] => {
		const sceneSubjects: any[] = [
			InteractiveMap(scene),
			GlobalIllumination(scene),
		];
		
		return sceneSubjects;
	};
	
	// Initialize scene
	const scene = buildScene();
	const renderer = buildRenderer(canvas, sizes);
	const camera = buildCamera(scene, sizes, {x: 0, y: 1, z: 3});
	const clock = buildClock();
	const sceneSubjects = createSceneSubjects();

	// Event bindings
	const onWindowResizeCallback = () => onWindowResize(renderer, camera, sizes);
	
	// Update
	const update = (): void => {
		for(let i=0; i<sceneSubjects.length; i++) {
			sceneSubjects[i].update();
		}
  		renderer.render(scene, camera);
	};

	return {
		update,
		onWindowResizeCallback,
	};
}

export default SceneManager;
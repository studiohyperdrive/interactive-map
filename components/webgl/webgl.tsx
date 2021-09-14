import React, { useEffect, useRef } from 'react';

import { WebGLProps } from './webgl.types';
import ThreeEntryPoint from '../../webgl/three-entry-point';

const WebGL: React.FC<WebGLProps> = () => {
	const threeRootElement = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (threeRootElement.current) {
			ThreeEntryPoint(threeRootElement.current);
		}
	}, []);

	return (
		<canvas id="SHDGate" ref={threeRootElement} />
	);
};

export default WebGL;

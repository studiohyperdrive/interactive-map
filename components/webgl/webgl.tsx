import React, { useEffect, useRef } from 'react';

import ThreeEntryPoint from '../../webgl/three-entry-point';
import click from '../../bindings/click';

import { WebGLProps } from './webgl.types';

const WebGL: React.FC<WebGLProps> = () => {
	const threeRootElement = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (threeRootElement.current) {
			new ThreeEntryPoint(
				threeRootElement.current,
				click
			);
		}
	}, []);

	return (
		<canvas id="SHDGate" ref={threeRootElement} />
	);
};

export default WebGL;

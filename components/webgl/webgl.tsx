import React, { useEffect, useRef } from 'react';
import { Mesh, MeshPhysicalMaterial } from 'three';

import ThreeEntryPoint from '../../webgl/three-entry-point';

import { WebGLProps } from './webgl.types';

const WebGL: React.FC<WebGLProps> = () => {
	const threeRootElement = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (threeRootElement.current) {
			new ThreeEntryPoint(
				threeRootElement.current,
				[
					{
						name: 'skyscraper',
						matching: 'partial',
						onClick: (mesh: Mesh) => {
							const random = new MeshPhysicalMaterial();
							random.color.setHex(Math.random() * 0xffffff);
	
							mesh.material = random;
						}
					}
				]
			);
		}
	}, []);

	return (
		<canvas id="SHDGate" ref={threeRootElement} />
	);
};

export default WebGL;

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
						},
						onHoverStart: (mesh: Mesh) => {
							const random = new MeshPhysicalMaterial({ color: Math.random() * 0xffffff });
							mesh.material = random;
						},
						onHoverEnd: (mesh: Mesh) => {
							const random = new MeshPhysicalMaterial({ 
								color: 0xE7E7E7,
								metalness: 0.173,
								specularIntensity: 0.5,
								roughness: 0.5,
								clearcoatRoughness: 0.03,
							});
							mesh.material = random;
						},
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

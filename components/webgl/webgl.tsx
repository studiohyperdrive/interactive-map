import React, { useEffect, useRef } from 'react';

import ThreeEntryPoint from '../../webgl/three-entry-point';
import click from '../../bindings/click';
import hover from '../../bindings/hover';
import animation from '../../bindings/animation';

import { WebGLProps } from './webgl.types';

const WebGL: React.FC<WebGLProps> = () => {
	const threeRootElement = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (threeRootElement.current) {
			new ThreeEntryPoint(
				threeRootElement.current,
				click,
				hover,
				animation,
			);
		}
	}, []);

	return (
        <div>
		    <canvas ref={threeRootElement} />
            <div className="webgl__rotate-buttons">
                <div className="webgl__rotate-button" id="webgl__rotate-left">{'<-'}</div>
                <div className="webgl__rotate-button" id="webgl__rotate-right">{'->'}</div>
            </div>
        </div>
	);
};

export default WebGL;

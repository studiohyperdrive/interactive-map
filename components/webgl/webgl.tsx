import React, { useEffect, useRef } from 'react';

import { WebGLProps } from './webgl.types';
import ThreeEntryPoint from '../../webgl/three-entry-point';

const WebGL: React.FC<WebGLProps> = () => {
	const threeRootElement = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (threeRootElement.current) {
			new ThreeEntryPoint(threeRootElement.current);
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

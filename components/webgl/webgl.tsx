import React, { useEffect, useRef } from "react";
import { useRouter } from "next/dist/client/router";

import ThreeEntryPoint from "../../webgl/three-entry-point";
import createClickBindings from "../../bindings/click";
import hover from "../../bindings/hover";

import actions from "../../redux/actions";
import store from "../../redux/store";

import { WebGLProps } from "./webgl.types";

const WebGL: React.FC<WebGLProps> = ({three}) => {
	const threeRootElement = useRef<HTMLCanvasElement | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (threeRootElement.current) {
			if (three === undefined) {
				store.dispatch({
					type: actions.three.set,
					payload: new ThreeEntryPoint(
						threeRootElement.current,
						createClickBindings(router),
						hover,
					)
				});
			} else {
				threeRootElement.current?.replaceWith(three.canvas);
			}
		}
	}, []);

	return (
        <div>
		    <canvas ref={threeRootElement} />

            <div className="webgl__rotate-buttons">
                <div className="webgl__rotate-button" onClick={() => {
					const manager = store.getState().three?.manager;
					manager?.controls?.handleClickRotateLeft();
					manager?.update();
				}}>{"<-"}</div>
				
                <div className="webgl__rotate-button" onClick={() => {
					const manager = store.getState().three?.manager;
					manager?.controls?.handleClickRotateRight();
					manager?.update();
				}}>{"->"}</div>
            </div>
        </div>
	);
};

export default WebGL;

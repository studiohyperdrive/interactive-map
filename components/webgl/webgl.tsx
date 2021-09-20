import { FC, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/dist/client/router";

import ThreeEntryPoint from "../../webgl/three-entry-point";
import createClickBindings from "../../bindings/click";
import createHoverBindings from "../../bindings/hover";

import actions from "../../redux/actions";
import store from "../../redux/store";

import { WebGLProps } from "./webgl.types";

const WebGL: FC<WebGLProps> = ({ three }) => {
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
            createHoverBindings(store),
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

export default connect((state: {three?: ThreeEntryPoint}) => {
  return {three: state.three};
})(WebGL);

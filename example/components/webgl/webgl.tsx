import { FC, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/dist/client/router";

import createClickBindings from "../../bindings/click";
import createHoverBindings from "../../bindings/hover";
import animation from '../../bindings/animation';
import sceneConfig from "../../config/sceneConfig";

import actions from "../../redux/actions";
import store from "../../redux/store";

import { WebGLProps } from "./webgl.types";
import ThreeEntryPoint from "@shd-developer/interactive-map/dist/three-entry-point";

const WebGL: FC<WebGLProps> = ({ three, disabled }) => {
  const threeRootElement = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (threeRootElement.current) {
      if (three === undefined) {
        store.dispatch({
          type: actions.three.set,
          payload: new ThreeEntryPoint(
            threeRootElement.current,
            sceneConfig,
            createClickBindings(store, router),
            createHoverBindings(store),
            animation,
          )
        });
      } else {
        threeRootElement.current?.replaceWith(three.canvas);
      }
    }
  }, [router, three]);

  if (three) {
    if (disabled) {
      three.unbindEventListeners();
    } else if (!three.interactive) {
      three.bindEventListeners(three.click, three.hover);
    }
  }

  return (
    <div>
      <canvas ref={threeRootElement} />

      <div className="webgl__rotate-buttons">
        <div className="webgl__rotate-button" onClick={() => {
          const manager = three?.manager;
          manager?.controls?.handleClickRotateLeft();
          manager?.update();
        }}>{"<-"}</div>

        <div className="webgl__rotate-button" onClick={() => {
          const manager = three?.manager;
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

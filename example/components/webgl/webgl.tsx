import { FC, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/dist/client/router";

import createClickBindings from "../../bindings/click";
import createHoverBindings from "../../bindings/hover";
import animation from '../../bindings/animation';

import actions from "../../redux/actions";
import store from "../../redux/store";

import { WebGLProps } from "./webgl.types";
import ThreeEntryPoint from "@shd-developer/interactive-map/dist/three-entry-point";
import DataStore from "@shd-developer/interactive-map/dist/data-store/data-store";
import ClickPlugin from "@shd-developer/interactive-map/dist/plugins/click-plugin/click-plugin";
import MousePositionPlugin from "@shd-developer/interactive-map/dist/plugins/mouse-position-plugin/mouse-position-plugin";
import RaycasterPlugin from "@shd-developer/interactive-map/dist/plugins/raycaster-plugin/raycaster-plugin";

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
            createClickBindings(store, router),
            createHoverBindings(store),
            animation,
            [new ClickPlugin(
              createClickBindings(store, router),
              'click',
            )],
            new DataStore(),
            [
              new MousePositionPlugin,
              new RaycasterPlugin({trigger: "click"}),
            ],
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

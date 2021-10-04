import { FC, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/dist/client/router";

import createClickBindings from "../../bindings/click";
import createHoverBindings from "../../bindings/hover";
import animationConfig from '../../bindings/animation';
import sceneConfig from "../../config/sceneConfig";

import actions from "../../redux/actions";
import store from "../../redux/store";

import { WebGLProps } from "./webgl.types";
import ThreeEntryPoint from "@shd-developer/interactive-map/dist/three-entry-point";
import ClickPlugin from "@shd-developer/interactive-map/dist/plugins/click-plugin/click-plugin";
import HoverPlugin from "@shd-developer/interactive-map/dist/plugins/hover-plugin/hover-plugin";
import MousePositionPlugin from "@shd-developer/interactive-map/dist/plugins/mouse-position-plugin/mouse-position-plugin";
import RaycasterPlugin from "@shd-developer/interactive-map/dist/plugins/raycaster-plugin/raycaster-plugin";
import AnimationPlugin from "@shd-developer/interactive-map/dist/plugins/animation-plugin/animation-plugin";
import GltfDracoLoaderPlugin from "@shd-developer/interactive-map/dist/plugins/gltf-draco-loader-plugin/gltf-draco-loader-plugin";
import ClockPlugin from "@shd-developer/interactive-map/dist/plugins/clock-plugin/clock-plugin";
import AnimationMixerPlugin from "@shd-developer/interactive-map/dist/plugins/animation-mixer-plugin/animation-mixer-plugin";

const WebGL: FC<WebGLProps> = ({ three, disabled }) => {
  const threeRootElement = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  const buildThree = (): ThreeEntryPoint | null => {
    return threeRootElement.current ? new ThreeEntryPoint(
      threeRootElement.current,
      sceneConfig,
      [
        new ClickPlugin(
          createClickBindings(store, router),
          'click',
        ),
        new HoverPlugin(
          createHoverBindings(store),
        ),
      ],
      [
        new GltfDracoLoaderPlugin("/models/interactive-map_v2.8-draco.glb"),
        new ClockPlugin,
        new AnimationMixerPlugin,
        new MousePositionPlugin,
        new RaycasterPlugin({trigger: "mousemove"}),
        new AnimationPlugin(animationConfig),
      ],
    ) : null;
  }

  // Run once
  useEffect(() => {
    if (three === undefined) {
      store.dispatch({
        type: actions.three.set,
        payload: buildThree()
      });
    } else {
      threeRootElement.current?.replaceWith(three.canvas);
    }
  }, [router, three]);

  // Check if three should be disabled
  if (three) {
    if (disabled) {
      three.unbindEventListeners();
    } else if (!three.interactive) {
      three.bindEventListeners();
    }
  }

  return (
    <div>
      {/* <div className="im__webgl--container"> */}
        <canvas ref={threeRootElement} />
      {/* </div> */}

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

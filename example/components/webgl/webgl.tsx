import { FC, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/dist/client/router";

import createClickBindings from "../../bindings/click";
import createHoverBindings from "../../bindings/hover";
import animationConfig from '../../bindings/animation';

import actions from "../../redux/actions";
import store from "../../redux/store";

import { WebGLProps } from "./webgl.types";
import sceneConfig from "../../config/sceneConfig";
import ThreeEntryPoint from "@shd-developer/interactive-map/dist/three-entry-point";
import ClickPlugin from "@shd-developer/interactive-map/dist/plugins/click-plugin/click-plugin";
import HoverPlugin from "@shd-developer/interactive-map/dist/plugins/hover-plugin/hover-plugin";
import MousePositionPlugin from "@shd-developer/interactive-map/dist/plugins/mouse-position-plugin/mouse-position-plugin";
import RaycasterPlugin from "@shd-developer/interactive-map/dist/plugins/raycaster-plugin/raycaster-plugin";
import AnimationPlugin from "@shd-developer/interactive-map/dist/plugins/animation-plugin/animation-plugin";
import GltfDracoLoaderPlugin from "@shd-developer/interactive-map/dist/plugins/gltf-draco-loader-plugin/gltf-draco-loader-plugin";
import ClockPlugin from "@shd-developer/interactive-map/dist/plugins/clock-plugin/clock-plugin";
import AnimationMixerPlugin from "@shd-developer/interactive-map/dist/plugins/animation-mixer-plugin/animation-mixer-plugin";
import BrowserResizePlugin from "@shd-developer/interactive-map/dist/plugins/browser-resize-plugin/browser-resize-plugin";
import GlobalIlluminationPlugin from "@shd-developer/interactive-map/dist/plugins/global-illumination-plugin/global-illumination-plugin";
import MapControlsPlugin from "@shd-developer/interactive-map/dist/plugins/map-controls-plugin/map-controls-plugin";

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
            [
              new BrowserResizePlugin,
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
              new GlobalIlluminationPlugin,
              new ClockPlugin,
              new AnimationMixerPlugin,
              new MousePositionPlugin,
              new RaycasterPlugin({trigger: "mousemove"}),
              new AnimationPlugin(animationConfig),
              new MapControlsPlugin,
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
      three.bindEventListeners();
    }
  }

  return (
    <div>
      {/* <div className="im__webgl--container"> */}
        <canvas ref={threeRootElement} />
      {/* </div> */}
    </div>
  );
};

export default connect((state: {three?: ThreeEntryPoint}) => {
  return {three: state.three};
})(WebGL);

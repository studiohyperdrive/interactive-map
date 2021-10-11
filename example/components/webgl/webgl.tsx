import { FC, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/dist/client/router";

import ThreeEntryPoint from "@shd-developer/interactive-map/dist/three-entry-point";
import { ClickPlugin, HoverPlugin, MousePositionPlugin, RaycasterPlugin, AnimationPlugin, GltfDracoLoaderPlugin, ClockPlugin, AnimationMixerPlugin, TabNavigationPlugin, BrowserResizePlugin, GlobalIlluminationPlugin, MapControlsPlugin, WebglRendererPlugin } from "@shd-developer/interactive-map/dist/plugins";

import animationConfig from '../../bindings/animation';
import createClickBindings from "../../bindings/click";
import createHoverBindings from "../../bindings/hover";
import createTabNavigationBindings from "../../bindings/tab-navigation";

import { ortho } from "../../config/sceneConfig";
import controlsConfig from "../../config/controlsConfig";

import actions from "../../redux/actions";
import store from "../../redux/store";

import { WebGLProps } from "./webgl.types";

const WebGL: FC<WebGLProps> = ({ three, disabled }) => {
  const threeRootElement = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  const buildThree = (): ThreeEntryPoint | null => {
    return threeRootElement.current ? new ThreeEntryPoint(
      threeRootElement.current,
      ortho,
      [
        new BrowserResizePlugin(window),
        new MousePositionPlugin,
        new RaycasterPlugin({ trigger: "mousemove" }),
        new ClickPlugin(
          createClickBindings(store, router),
        ),
        new HoverPlugin(
          createHoverBindings(store),
        ),
        new TabNavigationPlugin(
          createTabNavigationBindings(),
        )
      ],
      [
        new GltfDracoLoaderPlugin("/models/interactive-map_v2.8-draco.glb"),
        new GlobalIlluminationPlugin,
        new ClockPlugin,
        new AnimationMixerPlugin,
        new AnimationPlugin(animationConfig),
        new MapControlsPlugin(controlsConfig),
        new WebglRendererPlugin
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
    <div className="crosshair">
      {/* <div className="im__webgl--container"> */}
      <canvas ref={threeRootElement} />
      {/* </div> */}
    </div>
  );
};

export default connect((state: { three?: ThreeEntryPoint }) => {
  return { three: state.three };
})(WebGL);

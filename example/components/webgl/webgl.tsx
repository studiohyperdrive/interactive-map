import { FC, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/dist/client/router";

import ThreeEntryPoint from "@studiohyperdrive/interactive-map/dist/three-entry-point";
import {
  ClickPlugin,
  HoverPlugin,
  MousePositionPlugin,
  RaycasterPlugin,
  AnimationPlugin,
  GltfDracoLoaderPlugin,
  ClockPlugin,
  AnimationMixerPlugin,
  TabNavigationPlugin,
  CameraLerpPlugin,
  BrowserResizePlugin,
  GlobalIlluminationPlugin,
  MapControlsPlugin,
  IlluminationPlugin,
  WebglRendererPlugin,
} from "@studiohyperdrive/interactive-map/dist/plugins";
import { getChildren, hideChild, showChild, setNewCanvas } from "@studiohyperdrive/interactive-map/dist/utils";

import animationConfig from "../../bindings/animation";
import createClickBindings from "../../bindings/click";
import createHoverBindings from "../../bindings/hover";
import createTabNavigationBindings from "../../bindings/tab-navigation";

import { ortho, ortho2, perspective } from "../../config/sceneConfig";
import controlsConfig from "../../config/controlsConfig";
import illuminationConfig from "../../config/illuminationConfig";
import rendererConfig from "../../config/rendererConfig";

import actions from "../../redux/actions";
import store from "../../redux/store";

import { WebGLProps } from "./webgl.types";
import { Scene } from "three";

const WebGL: FC<WebGLProps> = ({ three, disabled }) => {
  const threeRootElement = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  const hideCheckmarks = (scene: Scene): void => {
    const keys = ["checkmark-1", "checkmark-2", "checkmark-3", "checkmark-4"];
    const targets = getChildren(scene, keys, "partial");

    targets.forEach(target => {
      hideChild(target);

      // setTimeout(() => {
      //   showChild(target);
      // }, 1000);
    });
  }

  const buildThree = (): ThreeEntryPoint | null => {
    return threeRootElement.current
      ? new ThreeEntryPoint(
          threeRootElement.current,
          ortho2,
          [
            new BrowserResizePlugin(window),
            new MousePositionPlugin(),
            new RaycasterPlugin({ trigger: "mousemove" }),
            new ClickPlugin(createClickBindings(store, router)),
            new HoverPlugin(createHoverBindings(store)),
            new TabNavigationPlugin(createTabNavigationBindings()),
          ],
          [
            new GltfDracoLoaderPlugin("/models/interactive-map_v2.8-draco.glb"),
            new GlobalIlluminationPlugin(),
            new IlluminationPlugin(illuminationConfig),
            new ClockPlugin(),
            new AnimationMixerPlugin(),
            new AnimationPlugin(animationConfig),
            new MapControlsPlugin(controlsConfig),
            new CameraLerpPlugin(2),
            new WebglRendererPlugin(rendererConfig)
          ]
        )
      : null;
  };

  // Run once
  useEffect(() => {
    if (three === undefined) {
      store.dispatch({
        type: actions.three.set,
        payload: buildThree(),
      });
    } else {
      if (threeRootElement.current) {
        threeRootElement.current.replaceWith(three.canvas);

        // See note in setNewCanvas function
        // setNewCanvas(three, threeRootElement.current);
      }
    }
  }, [router, three]);

  // Check if three should be disabled
  if (three) {
    if (disabled) {
      store.dispatch({ type: actions.three.disable });
    } else if (!three.interactive) {
      store.dispatch({ type: actions.three.enable });
    }
  }

  return <canvas ref={threeRootElement} />;
};

export default connect((state: { three?: ThreeEntryPoint }) => {
  return { three: state.three };
})(WebGL);

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
  BrowserResizePlugin,
  GlobalIlluminationPlugin,
  MapControlsPlugin,
  IlluminationPlugin,
  WebglRendererPlugin,
} from "@studiohyperdrive/interactive-map/dist/plugins";

import animationConfig from "../../bindings/animation";
import createClickBindings from "../../bindings/click";
import createHoverBindings from "../../bindings/hover";
import createTabNavigationBindings from "../../bindings/tab-navigation";

import { ortho, perspective } from "../../config/sceneConfig";
import controlsConfig from "../../config/controlsConfig";
import illuminationConfig from "../../config/illuminationConfig";
import rendererConfig from "../../config/rendererConfig";

import actions from "../../redux/actions";
import store from "../../redux/store";

import { WebGLProps } from "./webgl.types";

const WebGL: FC<WebGLProps> = ({ three, disabled }) => {
  const threeRootElement = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  const buildThree = (): ThreeEntryPoint | null => {
    return threeRootElement.current
      ? new ThreeEntryPoint(
          threeRootElement.current,
          ortho,
          [
            new BrowserResizePlugin(window),
            new MousePositionPlugin(),
            new RaycasterPlugin({ trigger: "mousemove" }),
            new ClickPlugin(createClickBindings(store, router)),
            // new HoverPlugin(createHoverBindings(store)),
            // new TabNavigationPlugin(createTabNavigationBindings()),
          ],
          [
            new GltfDracoLoaderPlugin("/models/boerderleren-draco.gltf"),
            // new GlobalIlluminationPlugin(),
            new IlluminationPlugin(illuminationConfig),
            new ClockPlugin(),
            new AnimationMixerPlugin(),
            new AnimationPlugin(animationConfig),
            new MapControlsPlugin(controlsConfig),
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
        const rendererPlugin = three.manager.plugins.find(plugin => {
          return plugin.renderer && plugin.sizes &&  plugin.setRenderer;
        });

        if (rendererPlugin) {
          rendererPlugin.renderer = rendererPlugin.setRenderer(threeRootElement.current, rendererPlugin.sizes, rendererConfig);
        }
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

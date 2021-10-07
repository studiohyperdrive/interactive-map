import { FC, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/dist/client/router';

import createClickBindings from '../../bindings/click';
import createHoverBindings from '../../bindings/hover';
import animationConfig from '../../bindings/animation';
import sceneConfig from '../../config/sceneConfig';
import controlsConfig from '../../config/controlsConfig';

import actions from '../../redux/actions';
import store from '../../redux/store';

import { WebGLProps } from './webgl.types';
import ThreeEntryPoint from '@shd-developer/interactive-map/dist/three-entry-point';
import {
  ClickPlugin,
  HoverPlugin,
  MousePositionPlugin,
  RaycasterPlugin,
  AnimationPlugin,
  GltfDracoLoaderPlugin,
  ClockPlugin,
  AnimationMixerPlugin,
  BrowserResizePlugin,
  GlobalIlluminationPlugin,
  MapControlsPlugin,
} from '@shd-developer/interactive-map/dist/plugins';

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
              new BrowserResizePlugin(),
              new ClickPlugin(createClickBindings(store, router)),
              //new HoverPlugin(createHoverBindings(store)),
            ],
            [
              new GltfDracoLoaderPlugin('/models/boerderleren-draco.gltf'),
              //new GlobalIlluminationPlugin(),
              new ClockPlugin(),
              new AnimationMixerPlugin(),
              new MousePositionPlugin(),
              new RaycasterPlugin({ trigger: 'mousemove' }),
              new AnimationPlugin(animationConfig),
              new MapControlsPlugin(controlsConfig),
            ]
          ),
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

  return <canvas ref={threeRootElement} />;
};

export default connect((state: { three?: ThreeEntryPoint }) => {
  return { three: state.three };
})(WebGL);

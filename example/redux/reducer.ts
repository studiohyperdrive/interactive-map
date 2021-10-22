import { AnyAction } from "redux";

import ThreeEntryPoint from "@studiohyperdrive/interactive-map/dist/three-entry-point";
import { IMousePositionPlugin, IRaycasterPlugin } from "@studiohyperdrive/interactive-map/dist/plugins";

import actions from "./actions";

const initialState: IState = {
  three: undefined,
  tooltip: undefined,
  dialogs: {
    ring: {
      open: false
    }
  }
}

export interface IState {
  three?: ThreeEntryPoint,
  tooltip?: string,
  dialogs: {
    ring: {
      open?: boolean
    }
  }
}

const enableThree = (three?: ThreeEntryPoint) => {
  if (three === undefined || three.interactive) {
    return;
  }

  three.bindEventListeners();
}

const disableThree = (three?: ThreeEntryPoint) => {
  if (three === undefined || !three.interactive) {
    return;
  }

  three.unbindEventListeners();

  // Prevent ghost clicks

  const mousePositionPlugin = three.plugins.find(plugin => plugin.clearMousePosition) as IMousePositionPlugin;
  const raycasterPlugin = three.plugins.find(plugin => plugin.raycaster && plugin.handleClick) as IRaycasterPlugin;

  if (mousePositionPlugin && raycasterPlugin) {
    mousePositionPlugin.clearMousePosition();
    raycasterPlugin.handleClick();
  }
}

export default function reducer(state: IState = initialState, action: AnyAction) {
  switch (action.type) {

    // Three.js

    case actions.three.set: {
      return { ...state, three: action.payload }
    }

    case actions.three.reset: {
      return { ...state, three: initialState.three };
    }

    case actions.three.enable: {
      enableThree(state.three);
      return { ...state };
    }

    case actions.three.disable: {
      disableThree(state.three);
      return { ...state };
    }

    // Tooltip

    case actions.tooltip.set: {
      return { ...state, tooltip: action.payload };
    }

    case actions.tooltip.reset: {
      return { ...state, tooltip: initialState.tooltip };
    }

    // Dialogs

    case actions.dialogs.ring.open: {
      return { ...state, dialogs: { ...state.dialogs, ring: { ...state.dialogs.ring, open: true } } };
    }

    case actions.dialogs.ring.close: {
      return { ...state, dialogs: { ...state.dialogs, ring: { ...state.dialogs.ring, open: false } } };
    }

    default: return state;
  }
}
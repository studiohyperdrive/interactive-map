import { AnyAction } from "redux";
import ThreeEntryPoint from "../webgl/three-entry-point";

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

  three.bindEventListeners(three.click, three.hover);
}

const disableThree = (three?: ThreeEntryPoint) => {
  if (three === undefined || !three.interactive) {
    return;
  }

  three.unbindEventListeners();
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

    // Tooltip

    case actions.tooltip.set: {
      return { ...state, tooltip: action.payload };
    }

    case actions.tooltip.reset: {
      return { ...state, tooltip: initialState.tooltip };
    }

    // Dialogs

    case actions.dialogs.ring.open: {
      disableThree(state.three);

      return { ...state, dialogs: { ...state.dialogs, ring: { ...state.dialogs.ring, open: true } } };
    }

    case actions.dialogs.ring.close: {
      enableThree(state.three);

      return { ...state, dialogs: { ...state.dialogs, ring: { ...state.dialogs.ring, open: false } } };
    }

    default: return state;
  }
}
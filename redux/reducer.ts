import { AnyAction } from "redux";

import actions from "./actions";

const initialState = {
  three: undefined,
  tooltip: undefined,
  dialogs: {
    ring: {
      open: false
    }
  }
}

export default function reducer(state = initialState, action: AnyAction) {
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
      (state.three as any)?.unbindEventListeners();
      return { ...state, dialogs: { ...state.dialogs, ring: { ...state.dialogs.ring, open: true } } };
    }

    case actions.dialogs.ring.close: {
      (state.three as any)?.bindEventListeners((state.three as any).click, (state.three as any).hover);
      return { ...state, dialogs: { ...state.dialogs, ring: { ...state.dialogs.ring, open: false } } };
    }

    default: return state;
  }
}
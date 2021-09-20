import { AnyAction } from "redux";

import actions from "./actions";

const initialState = {
  three: undefined,
  tooltip: undefined
}

export default function reducer(state = initialState, action: AnyAction) {
  console.info('reducer', action);
  
  switch (action.type) {
    case actions.three.set: {
      return { ...state, three: action.payload }
    }

    case actions.three.reset: {
      return { ...state, three: initialState.three };
    }

    case actions.tooltip.set: {
      return { ...state, tooltip: action.payload };
    }

    case actions.tooltip.reset: {
      return { ...state, tooltip: initialState.tooltip };
    }

    default: return state;
  }
}
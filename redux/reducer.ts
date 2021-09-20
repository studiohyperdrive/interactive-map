import { AnyAction } from "redux";

import actions from "./actions";

const initialState = {
  three: undefined
}

export default function reducer(state = initialState, action: AnyAction) {
  console.info("reducer", action);

  switch (action.type) {
    case actions.three.set: {
      return {
        ...state,
        three: action.payload
      }
    }

    case actions.three.reset: {
      return {
        ...state,
        three: undefined
      }
    }

    default: return state;
  }
}
import { createStore, Store } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

export default store as Store;
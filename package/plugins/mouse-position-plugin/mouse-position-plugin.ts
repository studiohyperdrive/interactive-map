import { calculateCursorX, calculateCursorY } from "../../utils";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { IMousePositionPlugin } from "./mouse-position-plugin.types";

export class MousePositionPlugin {
    constructor() {
        return class implements IMousePositionPlugin {
            private dataStore: IDataStore;
            
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;
            }

            public bindEventListener() {
                window.addEventListener("mousemove", this.handleMouseMove);
            }

            public unbindEventListener() {
                window.removeEventListener("mousemove", this.handleMouseMove);
            }

            public handleMouseMove = (e: MouseEvent) => {
                this.dataStore.set(constants.store.mousePosition, {x: calculateCursorX(e), y: calculateCursorY(e)});
            }

            public clearMousePosition = () => {
                this.dataStore.set(constants.store.mousePosition, undefined);
            }
        }
    }
}

export default MousePositionPlugin;
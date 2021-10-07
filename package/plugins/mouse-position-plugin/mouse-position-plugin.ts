import { calculateCursorX, calculateCursorY } from "../../utils";
import { IDataStore } from "../../data-store/data-store.types";

import { IMousePositionPlugin } from "./mouse-position-plugin.types";

export class MousePositionPlugin {
    constructor() {
        return class implements IMousePositionPlugin {
            private dataStore: IDataStore;
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;
            }

            public bindEventListener() {
                window.addEventListener('mousemove', this.handleMouseMove);
            }

            public unbindEventListener() {
                window.removeEventListener('mousemove', this.handleMouseMove);
            }

            public handleMouseMove = (e: MouseEvent) => {
                this.dataStore.set('mousePosition', {x: calculateCursorX(e), y: calculateCursorY(e)});
            }
        }
    }
}

export default MousePositionPlugin;
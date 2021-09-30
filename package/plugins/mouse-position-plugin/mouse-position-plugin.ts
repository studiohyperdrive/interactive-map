import { calculateCursorX, calculateCursorY } from "../../utils";
import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";
import { IMousePositionPlugin } from "./mouse-position-plugin.types";
import { ISceneProps } from "../../types";

export default class MousePositionPlugin {
    constructor() {
        return class implements IMousePositionPlugin {
            public dataStore: IDataStore;
            public sceneProps: ISceneProps;
            constructor(dataStore: DataStore, sceneProps: ISceneProps) {
                this.dataStore = dataStore;
                this.sceneProps = sceneProps;
                
                window.addEventListener('mousemove', this.handleMouseMove);
            }

            public handleMouseMove = (e: MouseEvent) => {
                this.dataStore.set('mousePosition', {x: calculateCursorX(e), y: calculateCursorY(e)});
            }

            public update() {}
        }
    }
}
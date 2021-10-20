import { MapControls } from "three/examples/jsm/controls/OrbitControls";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { ITabNavigationTransitionPlugin } from "./tab-navigation-transition-plugin.types";

export class TabNavigationTransitionPlugin {
    constructor(speed: number) {
        return class implements ITabNavigationTransitionPlugin {
            private dataStore: IDataStore;

            public controls: MapControls

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.controls = dataStore.get(constants.store.controls);
            }

            public update() {
                const delta = this.dataStore.get(constants.store.deltaTime);
                const target = this.dataStore.get(constants.store.zoomTarget);

                this.controls.target.lerp(target, delta * speed);
                this.controls.update();  
            }
        }
    }
}

export default TabNavigationTransitionPlugin;
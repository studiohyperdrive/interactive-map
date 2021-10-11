import { Clock } from "three";

import { IDataStore } from "../../data-store/data-store.types"
import constants from "../../constants";

import { IClockPlugin } from "./clock-plugin.types";

export class ClockPlugin {
    constructor() {
        return class implements IClockPlugin {
            private dataStore: IDataStore;

            public clock: Clock;
            public previousTime: number;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.clock = new Clock();
                this.previousTime = 0;
            }

            public update() {
                const elapsedTime = this.clock.getElapsedTime();
                const deltaTime = elapsedTime - this.previousTime;
                this.previousTime = elapsedTime;

                this.dataStore.set(constants.store.elapsedTime, elapsedTime)
                this.dataStore.set(constants.store.deltaTime, deltaTime)
            }
        }
    }
}

export default ClockPlugin;
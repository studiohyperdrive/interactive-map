import { AnimationMixer, Scene } from "three";

import { IDataStore } from "../../data-store/data-store.types"
import constants from "../../constants";

import { IAnimationMixerPlugin } from "./animation-mixer-plugin.types";

export class AnimationMixerPlugin {
    constructor() {
        return class implements IAnimationMixerPlugin {
            private dataStore: IDataStore;

            public scene: Scene;
            public mixer: AnimationMixer;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.scene = dataStore.get(constants.store.scene);
                this.mixer = new AnimationMixer(this.scene);

                dataStore.set(constants.store.animationMixer, this.mixer);
            }

            public update() {
                const deltaTime = this.dataStore.get(constants.store.deltaTime);
                this.mixer.update(deltaTime);
            }
        }
    }
}

export default AnimationMixerPlugin;
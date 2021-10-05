import { AnimationMixer, Scene } from "three";

import { IDataStore } from "../../data-store/data-store.types"
import { IAnimationMixerPlugin } from "./animation-mixer-plugin.types";

export default class AnimationMixerPlugin {
    constructor() {
        return class implements IAnimationMixerPlugin {
            private dataStore: IDataStore;

            public scene: Scene;
            public mixer: AnimationMixer;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.scene = dataStore.get("scene");
                this.mixer = new AnimationMixer(this.scene);

                dataStore.set("animationMixer", this.mixer);
            }

            public update() {
                const deltaTime = this.dataStore.get("deltaTime");
                this.mixer.update(deltaTime);
            }
        }
    }
}
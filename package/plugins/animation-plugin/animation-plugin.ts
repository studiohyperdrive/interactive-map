import { AnimationClip, AnimationMixer } from "three";

import { IAnimationConfig } from "../../types";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { IAnimationPlugin } from "./animation-plugin.types";
import { isMatching } from "../../utils/bindings";

export class AnimationPlugin {
    constructor(config: IAnimationConfig[]) {
        return class implements IAnimationPlugin{
            private dataStore: IDataStore;

            public mixer: AnimationMixer;
            public animationsStarted: boolean;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.mixer = dataStore.get(constants.store.animationMixer);

                this.dataStore.set(constants.store.animationConfig, config);

                this.animationsStarted = false;
            }

            public startAnimations() {
                const animations: AnimationClip[] = this.dataStore.get(constants.store.animations);

                config.forEach(animationData => {
                    animations.forEach((animationClip, i) => {
                        if (isMatching(animationClip, animationData)) {
                            const action = this.mixer.clipAction(animationClip);
                            action.loop = animationData.loop;
                            animationData.startAnimation(action, i);
                        }
                    })
                });
            }

            public update() {
                if (this.dataStore.get(constants.store.mapLoaded) && !this.animationsStarted) {
                    this.startAnimations();
                    this.animationsStarted = true;
                }
            }
        }
    }
}

export default AnimationPlugin;
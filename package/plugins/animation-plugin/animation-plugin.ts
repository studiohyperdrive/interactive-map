import { AnimationClip, AnimationMixer, Scene } from "three";
import { IBindingConfig, IAnimationConfig } from "../../types";
import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";
import { IAnimationPlugin } from "./animation-plugin.types";

export default class AnimationPlugin {
    constructor(config: IAnimationConfig[]) {
        return class implements IAnimationPlugin{
            private dataStore: IDataStore;

            public mixer: AnimationMixer;
            public animationsStarted: boolean;

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;

                this.mixer = dataStore.get("animationMixer");

                this.dataStore.set("animationConfig", config);

                this.animationsStarted = false;
            }

            public startAnimations() {
                const animations: AnimationClip[] = this.dataStore.get('animations');

                config.forEach(animationData => {
                    animations.forEach((animationClip, i) => {
                        if (this.isMatching(animationClip, animationData)) {
                            const action = this.mixer.clipAction(animationClip);
                            action.loop = animationData.loop;
                            animationData.startAnimation(action, i);
                        }
                    })
                });
            }

            // Utils?
            public isMatching(item: {name: string}, binding: IBindingConfig): boolean {
                switch (binding.matching) {
                    case "partial":
                        return item.name.indexOf(binding.name) > -1;
        
                    case "exact":
                    default:
                        return item.name === binding.name;
                }
            }


            public update() {
                if (this.dataStore.get("mapLoaded") && !this.animationsStarted) {
                    this.startAnimations();
                    this.animationsStarted = true;
                }
            }
        }
    }
}
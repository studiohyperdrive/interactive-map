import { AnimationClip, AnimationMixer, Mesh } from "three";

import { IAnimate, IBindingConfig, IClickBindingConfig } from "../../types";
import { isMatching } from "../../utils";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { IClickPlugin } from "./click-plugin.types";

export class ClickPlugin {
    constructor(bindings: IClickBindingConfig[]) {
        return class implements IClickPlugin{
            private dataStore: IDataStore;

            public animations: AnimationClip[];
            public mixer: AnimationMixer;
            
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.animations = dataStore.get(constants.store.animations);
                this.mixer = dataStore.get(constants.store.animationMixer);

                this.dataStore.set(constants.store.clickBindings, bindings);
            }

            public bindEventListener(): void {
                window.addEventListener("click", this.handleClick);
            }

            public unbindEventListener(): void {
                window.removeEventListener("click", this.handleClick);
            }

            public handleClick = (e: MouseEvent): void => {
                const intersection = this.dataStore.get(constants.store.intersection);

                if (!intersection) {
                    return;
                }

                const clicked = intersection.object;

                if (clicked instanceof Mesh) {
                    bindings.forEach(binding => {
                        if (isMatching(clicked, binding)) {
                            binding.onClick(clicked);

                            this.handleBindingAnimation(binding, (animation: AnimationClip, animationBinding: IAnimate) => {
                                const action = this.mixer.clipAction(animation);
                                action.loop = animationBinding.loop;
                                if (!action.isRunning()) {
                                    action.reset().play();
                                }
                            });
                        }
                    });
                }
            }

            public handleBindingAnimation(binding: IBindingConfig, callback: (animation: AnimationClip, animationBinding: IAnimate) => void) {
                if (binding.animate) {
                    this.animations = this.dataStore.get(constants.store.animations)
                    
                    binding.animate.forEach((animationBinding) => {
                        this.animations.forEach(animation => {
                            if (isMatching(animation, animationBinding)) {
                                callback(animation, animationBinding);
                            }
                        });
                    });
                }
            }
        }
    }
}

export default ClickPlugin;
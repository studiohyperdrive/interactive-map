import { AnimationClip, AnimationMixer, Mesh } from "three";

import { IAnimate } from "../../types";
import { handleBindingAnimations, isMatching } from "../../utils";

import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { IClickPlugin, IClickBindingConfig } from "./click-plugin.types";

export class ClickPlugin {
    constructor(bindings: IClickBindingConfig[]) {
        return class implements IClickPlugin {
            private dataStore: IDataStore;

            public bindings: IClickBindingConfig[] = bindings;
            public animations: AnimationClip[];
            public mixer: AnimationMixer;

            public listener: EventListener;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.animations = this.dataStore.get(constants.store.animations);
                this.mixer = this.dataStore.get(constants.store.animationMixer);

                this.dataStore.set(constants.store.clickBindings, bindings);

                this.listener = this.handleClick.bind(this) as EventListener;
            }

            public bindEventListener(): void {
                window.addEventListener("click", this.listener);
            }

            public unbindEventListener(): void {
                window.removeEventListener("click", this.listener);
            }

            public handleClick = (e: MouseEvent): void => {
                const intersection = this.dataStore.get(constants.store.intersection);

                if (!intersection) {
                    return;
                }

                const clicked = intersection.object;

                if (clicked instanceof Mesh) {
                    this.bindings.forEach(binding => {
                        if (isMatching(clicked, binding)) {
                            binding.onClick(clicked, this.dataStore);

                            // Check for animations
                            if (binding.animate && binding.animate.length > 0) {
                                this.animations = this.dataStore.get(constants.store.animations);

                                handleBindingAnimations(
                                    binding.animate,
                                    this.animations,
                                    (animation: AnimationClip, bind: IAnimate) => {
                                        // Reset and start and bound animations
                                        const action = this.mixer.clipAction(animation);
                                        action.loop = bind.loop;

                                        if (!action.isRunning()) {
                                            action.reset().play();
                                        }
                                    });
                            }
                        }
                    });
                }
            }
        }
    }
}

export default ClickPlugin;
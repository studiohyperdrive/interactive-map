import { AnimationClip, AnimationMixer, LoopOnce, Mesh } from "three";

import { IAnimate } from "../../types";
import constants from "../../constants";
import { handleBindingAnimations, isMatching } from "../../utils";

import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";

import { IHoverPlugin, IHoverBindingConfig } from "./hover-plugin.types";

export class HoverPlugin {
    constructor(bindings: IHoverBindingConfig[]) {
        return class implements IHoverPlugin {
            private dataStore: IDataStore;

            public bindings: IHoverBindingConfig[] = bindings;
            public animations: AnimationClip[];
            public mixer: AnimationMixer;
            public hovered: Mesh | null = null;

            public listener: EventListener;

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;

                this.animations = this.dataStore.get(constants.store.animations);
                this.mixer = this.dataStore.get(constants.store.animationMixer);

                this.dataStore.set(constants.store.hoverBindings, bindings);

                this.listener = this.handleHover.bind(this) as EventListener;
            }

            public bindEventListener(): void {
                window.addEventListener("mousemove", this.listener);
            }

            public unbindEventListener(): void {
                window.removeEventListener("mousemove", this.listener);
            }

            public handleHover = (e: MouseEvent): void => {
                const previous = this.hovered;
                const current = this.dataStore.get(constants.store.intersection)?.object;

                // Do nothing if the intersection didn't change
                if (previous === current) {
                    return
                }

                // Handle hover away first
                if (previous instanceof Mesh) {
                    this.bindings.forEach(binding => {
                        if (isMatching(previous, binding)) {
                            binding.onHoverEnd(previous, this.dataStore);

                            // Check for animations
                            if (binding.animate && binding.animate.length > 0) {
                                this.animations = this.dataStore.get(constants.store.animations);

                                handleBindingAnimations(
                                    binding.animate,
                                    this.animations,
                                    (animation: AnimationClip, bind: IAnimate) => {
                                        // Run the configured animations one final time
                                        const action = this.mixer.clipAction(animation);
                                        action.loop = LoopOnce;
                                    });
                            }
                        }
                    });
                }

                // Then handle hover next
                if (current instanceof Mesh) {
                    this.bindings.forEach(binding => {
                        if (isMatching(current, binding)) {
                            binding.onHoverStart(current, this.dataStore);

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

                // Remember the active element
                this.hovered = (current as Mesh);
            }
        }
    }
}

export default HoverPlugin;
import { AnimationClip, AnimationMixer, LoopOnce, Mesh } from "three";

import { IAnimate, IBindingConfig, IHoverBindingConfig } from "../../types";

import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { IHoverPlugin } from "./hover-plugin.types";
import { isMatching } from "../../utils/bindings";

export class HoverPlugin {
    constructor(bindings: IHoverBindingConfig[]) {
        return class implements IHoverPlugin{
            private dataStore: IDataStore;

            public animations: AnimationClip[];
            public mixer: AnimationMixer;
            public hovered: Mesh | null = null;

            public listener: EventListener;

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;

                this.animations = dataStore.get(constants.store.animations);
                this.mixer = dataStore.get(constants.store.animationMixer);

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
        
                if (previous === current) {
                    return
                }
        
                if (previous instanceof Mesh) {
                    bindings.forEach(binding => {
                        if (isMatching(previous, binding)) {
                            binding.onHoverEnd(previous);
                            this.handleBindingAnimation(binding, (animation: AnimationClip, animationBinding: IAnimate) => {
                                const action = this.mixer.clipAction(animation);
                                action.loop = LoopOnce;
                            });
                        }
                    });
                }
        
                if (current instanceof Mesh) {
                    bindings.forEach(binding => {
                        if (isMatching(current, binding)) {
                            binding.onHoverStart(current);
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
        
                this.hovered = (current as Mesh);
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

export default HoverPlugin;
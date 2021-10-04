import { AnimationClip, AnimationMixer, LoopOnce, Mesh } from "three";

import { IAnimate, IBindingConfig, IHoverBindingConfig } from "../../types";

import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";

import { IHoverPlugin } from "./hover-plugin.types";

export class HoverPlugin {
    constructor(bindings: IHoverBindingConfig[]) {
        return class implements IHoverPlugin{
            private dataStore: IDataStore;

            public animations: AnimationClip[];
            public mixer: AnimationMixer;
            public hovered: Mesh | null = null;

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;

                this.animations = dataStore.get("animations");
                this.mixer = dataStore.get("animationMixer");
            }

            public bindEventListener(): void {
                window.addEventListener("mousemove", e => this.handleHover(e as MouseEvent));
            }

            public unbindEventListener(): void {
                window.removeEventListener("mousemove", e => this.handleHover(e as MouseEvent));
            }

            public handleHover(e: MouseEvent): void {
                const previous = this.hovered;
                const current = this.dataStore.get('intersection')?.object;
        
                if (previous === current) {
                    return
                }
        
                if (previous instanceof Mesh) {
                    bindings.forEach(binding => {
                        if (this.isMatching(previous, binding)) {
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
                        if (this.isMatching(current, binding)) {
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

            public handleBindingAnimation(binding: IBindingConfig, callback: (animation: AnimationClip, animationBinding: IAnimate) => void) {
                if (binding.animate) {
                    this.animations = this.dataStore.get("animations")
                    
                    binding.animate.forEach((animationBinding) => {
                        this.animations.forEach(animation => {
                            if (this.isMatching(animation, animationBinding)) {
                                callback(animation, animationBinding);
                            }
                        });
                    });
                }
            }
        }
    }
}
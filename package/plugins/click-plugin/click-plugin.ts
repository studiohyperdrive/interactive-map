import { AnimationClip, AnimationMixer, Mesh } from "three";

import { IAnimate, IBindingConfig, IClickBindingConfig } from "../../types";

import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";

import { IClickPlugin } from "./click-plugin.types";

export class ClickPlugin {
    constructor(bindings: IClickBindingConfig[], type: string) {
        return class implements IClickPlugin{
            private dataStore: IDataStore;

            public animations: AnimationClip[];
            public mixer: AnimationMixer;

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;

                this.animations = dataStore.get("animations");
                this.mixer = dataStore.get("animationMixer");

                this.dataStore.set(`${type}Bindings`, bindings);
            }

            public bindEventListener(): void {
                window.addEventListener(type, e => this.handleClick(e as MouseEvent));
            }

            public unbindEventListener(): void {
                window.removeEventListener(type, e => this.handleClick(e as MouseEvent));
            }

            public handleClick = (e: MouseEvent): void => {
                const intersection = this.dataStore.get("intersection");
                if (!intersection) {
                    return;
                }

                const clicked = intersection.object;

                if (clicked instanceof Mesh) {
                    bindings.forEach(binding => {
                        if (this.isMatching(clicked, binding)) {``
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
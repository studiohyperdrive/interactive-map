import { AnimationClip, AnimationMixer, Mesh } from "three";

import { IAnimate } from "../../types";
import { calculateCursorX, calculateCursorY, handleBindingAnimations, isMatching } from "../../utils";

import constants from "../../constants";
import { IDataStore } from "../../data-store/data-store.types";

import { IClickPlugin, IClickBindingConfig } from "./click-plugin.types";

export class ClickPlugin {
    constructor(bindings: IClickBindingConfig[], clickMargin: number = 0.015) {
        return class implements IClickPlugin {
            private dataStore: IDataStore;

            private position: {
                start?: { x: number, y: number },
                end?: { x: number, y: number }
            } = {};

            public bindings: IClickBindingConfig[] = bindings;
            public animations: AnimationClip[];
            public mixer: AnimationMixer;
            public margin: number = clickMargin;

            public listeners: {
                up: EventListener,
                down: EventListener,
                click: EventListener
            }

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.animations = this.dataStore.get(constants.store.animations);
                this.mixer = this.dataStore.get(constants.store.animationMixer);

                this.dataStore.set(constants.store.clickBindings, bindings);

                this.listeners = {
                    down: this.handleMouseDown.bind(this) as EventListener,
                    up: this.handleMouseUp.bind(this) as EventListener,
                    click: this.handleClick.bind(this) as EventListener,
                }
            }

            public bindEventListener(): void {
                window.addEventListener("mousedown", this.listeners.down);
                window.addEventListener("mouseup", this.listeners.up);
                window.addEventListener("click", this.listeners.click);
            }

            public unbindEventListener(): void {
                window.removeEventListener("mousedown", this.listeners.down);
                window.removeEventListener("mouseup", this.listeners.up);
                window.removeEventListener("click", this.listeners.click);
            }

            public handleClick = (e: MouseEvent): void => {
                const drag = this.isDragged(this.position);

                if (drag) {
                    return;
                }

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

            public handleMouseDown = (e: MouseEvent): void => {
                this.position.start = { x: calculateCursorX(e), y: calculateCursorY(e) };
            }

            public handleMouseUp = (e: MouseEvent): void => {
                this.position.end = { x: calculateCursorX(e), y: calculateCursorY(e) };
            }

            public isDragged = (pair: typeof this.position): boolean => {
                const a = (pair.start?.x || 0) - (pair.end?.x || 0);
                const b = (pair.start?.y || 0) - (pair.end?.y || 0);

                const distance = Math.sqrt(a * a + b * b);

                return distance > this.margin;
            }
        }
    }
}

export default ClickPlugin;
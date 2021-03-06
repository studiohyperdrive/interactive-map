import { AnimationClip, AnimationMixer, Scene } from "three";

import { BindingCallback, IAnimate } from "../../types";
import { flattenChildren, handleBindingAnimations, isMatching } from "../../utils";

import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { ITabNavigationPlugin, ITabNavigationBindingConfig } from "./tab-navigation-plugin.types";

export class TabNavigationPlugin {
    constructor(bindings: ITabNavigationBindingConfig[], first?: BindingCallback, last?: BindingCallback) {
        return class implements ITabNavigationPlugin {
            private dataStore: IDataStore;

            public scene: Scene;
            public animations: AnimationClip[];
            public bindings: ITabNavigationBindingConfig[] = bindings.sort((a, b) => a.order - b.order);
            public current?: ITabNavigationBindingConfig = undefined;
            public mixer: AnimationMixer;

            public listeners: {
                tab: EventListener,
                shiftTab: EventListener
            }

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;

                this.animations = this.dataStore.get(constants.store.animations);
                this.scene = this.dataStore.get(constants.store.scene);
                this.mixer = this.dataStore.get(constants.store.animationMixer);

                this.dataStore.set(constants.store.zoomProps, undefined);

                this.listeners = {
                    tab: this.handleTabPress.bind(this) as EventListener,
                    shiftTab: this.handleShiftTabPress.bind(this) as EventListener
                };
            }

            public bindEventListener(): void {
                document.addEventListener("keydown", this.listeners.tab);
                document.addEventListener("keydown", this.listeners.shiftTab);
            }

            public unbindEventListener(): void {
                document.removeEventListener("keydown", this.listeners.tab);
                document.removeEventListener("keydown", this.listeners.shiftTab);
            }

            public handleTabPress(e: KeyboardEvent): void {
                if (e.code !== "Tab" || e.shiftKey) return;

                this.navigate(e, true)
            }

            public handleShiftTabPress(e: KeyboardEvent): void {
                if (e.code !== "Tab" || !e.shiftKey) return;

                this.navigate(e, false)
            }

            public setZoomProps = (props: any) => {
                this.dataStore.set(constants.store.zoomProps, props);
            }

            public navigate(e: KeyboardEvent, forward: boolean): void {
                if (!this.dataStore.get(constants.store.mapLoaded)) return;

                const fallback = forward ? -1 : this.bindings.length;
                const i = this.current ? this.bindings.indexOf(this.current) : fallback;

                let next: ITabNavigationBindingConfig | undefined = undefined;

                if (forward && (i + 1) <= this.bindings.length) {
                    next = this.bindings[i + 1];
                }

                if (!forward && (i - 1) >= 0) {
                    next = this.bindings[i - 1];
                }

                if (next) {
                    e.preventDefault();
                } else {
                    // Provide support to execute an additional "afterNavigate" as the first and last item
                    let f = forward ? last : first;
                    f && f(null, this.dataStore);
                }

                this.current = next;

                // Only look through children if hook is defined
                if (next?.afterNavigate) {
                    flattenChildren(this.scene.children, Infinity).forEach(child => {
                        if (next && isMatching(child, next)) {
                            (next.afterNavigate as BindingCallback)(
                                child,
                                this.dataStore
                            );

                            // Check for animations
                            if (next.animate && next.animate.length > 0) {
                                this.animations = this.dataStore.get(constants.store.animations);

                                handleBindingAnimations(
                                    next.animate,
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

export default TabNavigationPlugin;
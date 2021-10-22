import { Scene } from "three";

import { flattenChildren, isMatching } from "../../utils";

import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";
import constants from "../../constants";

import { ITabNavigationPlugin, ITabNavigationBinding } from "./tab-navigation-plugin.types";

export class TabNavigationPlugin {
    constructor(bindings: ITabNavigationBinding[]) {
        return class implements ITabNavigationPlugin {
            private dataStore: IDataStore;

            public scene: Scene;

            public current?: ITabNavigationBinding = undefined;
            public bindings: ITabNavigationBinding[] = bindings.sort((a,b) => a.order - b.order);

            public listeners: {
                tab: EventListener,
                shiftTab: EventListener
            }

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;

                this.scene = this.dataStore.get(constants.store.scene);

                dataStore.set(constants.store.zoomProps, undefined);

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

                let next: ITabNavigationBinding | undefined = undefined;

                if (forward && (i + 1) <= this.bindings.length) {
                    next = this.bindings[i + 1];
                }

                if (!forward && (i - 1) >= 0) {
                    next = this.bindings[i - 1];
                }

                if (next) {
                    e.preventDefault();
                }

                this.current = next;

                // Only look through children if hook is defined
                if (next?.afterNavigate) {
                    flattenChildren(this.scene.children).forEach(child => {
                        if (next && isMatching(child, next)) {
                            (next.afterNavigate as Function)(
                                this.dataStore.get(constants.store.camera),
                                this.dataStore.get(constants.store.controls),
                                [child],
                                this.setZoomProps,
                            );
                        }
                    });
                }
            }
        }
    }
}

export default TabNavigationPlugin;
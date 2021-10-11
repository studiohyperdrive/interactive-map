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

            private handleTabPressListener: EventListenerOrEventListenerObject;
            private handleShiftTabPressListener: EventListenerOrEventListenerObject;

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;

                this.scene = dataStore.get(constants.store.scene);

                this.handleTabPressListener = (e: Event) => {this.handleTabPress((e as KeyboardEvent))};
                this.handleShiftTabPressListener = (e: Event) => {this.handleShiftTabPress((e as KeyboardEvent))};
            }

            public bindEventListener(): void {
                document.addEventListener("keydown", this.handleTabPressListener);
                document.addEventListener("keydown", this.handleShiftTabPressListener);
            }

            public unbindEventListener(): void {
                document.removeEventListener("keydown", this.handleTabPressListener);
                document.removeEventListener("keydown", this.handleShiftTabPressListener);
            }

            public handleTabPress(e: KeyboardEvent): void {
                if (e.code !== "Tab" || e.shiftKey) return;

                this.navigate(e, true)
            }

            public handleShiftTabPress(e: KeyboardEvent): void {
                if (e.code !== "Tab" || !e.shiftKey) return;

                this.navigate(e, false)
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
                            (next.afterNavigate as Function)(this.dataStore.get(constants.store.camera), this.dataStore.get(constants.store.controls), [child]);
                        }
                    });
                }
            }
        }
    }
}

export default TabNavigationPlugin;
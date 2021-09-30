import { Mesh } from "three";
import { IClickBindingConfig } from "../../types";
import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";
import { IClickPlugin } from "./click-plugin.types";

export default class ClickPlugin {
    constructor(bindings: IClickBindingConfig[], type: string) {
        return class implements IClickPlugin{
            private dataStore: IDataStore;
            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;
                this.dataStore.set(`${type}Bindings`, bindings);
            }

            bindEventListener(): void {
                window.addEventListener(type, e => this.handleClick(e as MouseEvent));
            }

            unbindEventListener(): void {
                window.removeEventListener(type, e => this.handleClick(e as MouseEvent));
            }

            handleClick = (e: MouseEvent): void => {
                const intersection = this.dataStore.get('intersection');
                if (!intersection) {
                    return;
                }

                const clicked = intersection.object;

                if (clicked instanceof Mesh) {
                    bindings.forEach(binding => {
                        if (this.isMatching(clicked, binding)) {
                            binding.onClick(clicked);
                        }
                    });
                }
            }

            // Utils?
            public isMatching(item: {name: string}, binding: IClickBindingConfig): boolean {
                switch (binding.matching) {
                    case "partial":
                        return item.name.indexOf(binding.name) > -1;
        
                    case "exact":
                    default:
                        return item.name === binding.name;
                }
            }
        }
    }
}
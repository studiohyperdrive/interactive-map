import { Mesh } from "three";
import { IHoverBindingConfig } from "../../types";
import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";
import { IHoverPlugin } from "./hover-plugin.types";
import { IBindingConfig } from "../..";

export default class HoverPlugin {
    constructor(bindings: IHoverBindingConfig[]) {
        return class implements IHoverPlugin{
            private dataStore: IDataStore;

            public hovered: Mesh | null = null;
            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;
            }

            bindEventListener(): void {
                window.addEventListener("mousemove", e => this.handleHover(e as MouseEvent));
            }

            unbindEventListener(): void {
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
                        }
                    });
                }
        
                if (current instanceof Mesh) {
                    bindings.forEach(binding => {
                        if (this.isMatching(current, binding)) {
                            binding.onHoverStart(current);
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
        }
    }
}
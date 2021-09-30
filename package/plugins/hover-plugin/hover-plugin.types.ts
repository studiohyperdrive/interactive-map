import { Mesh } from "three";
import { IBindingConfig } from "../..";
import { IDataStore } from "../../data-store/data-store.types";
import { IEventPlugin, IHoverBindingConfig } from "../../types";

export interface IHoverPlugin extends IEventPlugin {
    hovered: Mesh | null,
    handleHover: (e: MouseEvent) => void,
    isMatching: (item: {name: string}, binding: IBindingConfig) => boolean,
}
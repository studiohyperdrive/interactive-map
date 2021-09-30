import { IBindingConfig, IEventPlugin } from "../../types";

export interface IClickPlugin extends IEventPlugin {
    handleClick: (e: MouseEvent) => void,
    isMatching: (item: {name: string}, binding: IBindingConfig) => boolean,
}
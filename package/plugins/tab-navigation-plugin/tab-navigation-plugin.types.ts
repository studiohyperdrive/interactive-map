import { IBindingConfig } from "../..";
import { IEventPlugin } from "../../types";

export interface ITabNavigationPlugin extends IEventPlugin {
}

export interface ITabNavigationBinding extends IBindingConfig {
    afterNavigate?: Function
    boundingBoxScale?: number
    order: number
}
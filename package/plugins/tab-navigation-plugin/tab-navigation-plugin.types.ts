import { IEventPlugin, IBindingConfig } from "../../types";

export interface ITabNavigationPlugin extends IEventPlugin {
    handleTabPress(e: KeyboardEvent): void
    handleShiftTabPress(e: KeyboardEvent): void
    navigate(e: KeyboardEvent, forward: boolean): void
}

export interface ITabNavigationBinding extends IBindingConfig {
    afterNavigate?: Function
    boundingBoxScale?: number
    order: number
}
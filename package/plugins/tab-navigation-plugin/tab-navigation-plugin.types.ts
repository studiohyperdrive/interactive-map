import { IEventPlugin, IBindingConfig, BindingCallback } from "../../types";

export interface ITabNavigationPlugin extends IEventPlugin {
    handleTabPress(e: KeyboardEvent): void
    handleShiftTabPress(e: KeyboardEvent): void
    navigate(e: KeyboardEvent, forward: boolean): void
}

export interface ITabNavigationBindingConfig extends IBindingConfig {
    afterNavigate?: BindingCallback
    boundingBoxScale?: number
    order: number
}
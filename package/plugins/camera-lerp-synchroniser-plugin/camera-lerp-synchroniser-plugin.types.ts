import { ICameraLerpPlugin, IHoverPlugin, IRaycasterPlugin } from "..";
import { IScenePlugin } from "../../types";

export interface ICameraLerpSynchroniserPlugin extends IScenePlugin {
    lerp: ICameraLerpPlugin | undefined;
    raycaster: IRaycasterPlugin | undefined;
    hover: IHoverPlugin | undefined;
}

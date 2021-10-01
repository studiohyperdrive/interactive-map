import { Clock } from "three";
import { IScenePlugin } from "../../types";

export interface IClockPlugin extends IScenePlugin {
    clock: Clock,
    previousTime: number,
}
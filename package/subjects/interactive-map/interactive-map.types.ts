import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { IUpdates } from "../../types";

export default interface IInteractiveMap extends IUpdates {
    loader: GLTFLoader;
    instance: Group | null;
}
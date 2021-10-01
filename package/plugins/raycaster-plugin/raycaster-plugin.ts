import { Camera, Mesh, Raycaster, Scene } from "three";
import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";
import { flattenChildren } from "../../utils";
import { IRacasterPlugin, IRaycasterConfig } from "./raycaster-plugin.types";

export default class RaycasterPlugin {
    constructor(config: IRaycasterConfig) {
        return class implements IRacasterPlugin {
            private dataStore: IDataStore;

            public raycaster: Raycaster;
            public camera: Camera;
            public scene: Scene;

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;
                this.raycaster = new Raycaster();

                this.camera = dataStore.get("camera");
                this.scene = dataStore.get("scene");

                window.addEventListener(config.trigger, this.handleClick);
            }

            public handleClick = () => {
                const pos = this.dataStore.data.mousePosition;
                if (pos === undefined) {
                    return
                };
        
                this.raycaster.setFromCamera(pos, this.camera);
        
                const children = (flattenChildren(this.scene.children).filter(c => {
                    return c instanceof Mesh;
                }) as Mesh[]);
        
                this.dataStore.set('intersection', this.raycaster.intersectObjects(children)[0]);                
            }

            public update() {}
        }
    }
}
import { Mesh, Raycaster } from "three";
import { ISceneProps } from "../../types";
import DataStore from "../../data-store/data-store";
import { IDataStore } from "../../data-store/data-store.types";
import { flattenChildren } from "../../utils";
import { IRacasterPlugin, IRaycasterConfig } from "./raycaster-plugin.types";

export default class RaycasterPlugin {
    constructor(config: IRaycasterConfig) {
        return class implements IRacasterPlugin {
            private dataStore: IDataStore;
            public sceneProps: ISceneProps;
            public raycaster: Raycaster;

            constructor(dataStore: DataStore, sceneProps: any) {
                this.dataStore = dataStore;
                this.sceneProps = sceneProps;
                this.raycaster = new Raycaster();

                // This should come from config
                window.addEventListener(config.trigger, this.handleClick);
            }

            public handleClick = () => {
                const pos = this.dataStore.data.mousePosition;
                if (pos === undefined) {
                    return
                };
        
                this.raycaster.setFromCamera(pos, this.sceneProps.camera);
        
                const children = (flattenChildren(this.sceneProps.scene.children).filter(c => {
                    return c instanceof Mesh;
                }) as Mesh[]);
        
                this.dataStore.set('intersection', this.raycaster.intersectObjects(children)[0]);                
            }

            public update() {}
        }
    }
}
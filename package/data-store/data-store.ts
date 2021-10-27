import { IDataStore } from "./data-store.types";

export default class DataStore implements IDataStore {
    public data: { [key: string]: any };

    constructor() {
        this.data = {};
    }

    public set(key: string, value: any): void {
        this.data[key] = value;
    }

    public get(key: string): any {
        return this.data[key];
    }
}
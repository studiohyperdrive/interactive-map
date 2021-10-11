export interface IDataStore {
    data: {[key: string]: any},
    set: (key: string, value: any) => void,
    get: (key: string) => any,
}
import { IBindingConfig } from "../types";

export const isMatching = (item: { name: string, parent?: any }, binding: IBindingConfig): boolean => {
    const parentName = item.parent?.type === "Group"? item.parent.name : undefined;
    
    switch (binding.matching) {
        case "partial":
            return item.name.indexOf(binding.name) > -1 || parentName && parentName.indexOf(binding.name) > -1;

        case "exact":
        default:
            return item.name === binding.name || parentName && parentName === binding.name;
    }
}

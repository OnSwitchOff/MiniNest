import { container } from "../container";

export interface ModuleMetadata {
    providers?: any[];
    controllers?: any[];
    imports?: any[];
}
export const MODULE_METADATA_KEY = Symbol("module_metadata");

export function Module(metadata: ModuleMetadata) {
    return function (target: any) {
        Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, target);
    };
}
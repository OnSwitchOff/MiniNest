import {Pipe} from "./use-pipe";

export const PARAMS_METADATA_KEY = Symbol("params_metadata");

export function Param(
    name?: string,
    ...pipes: (new () => Pipe)[]
) {
    return function (
        target: any,
        propertyKey: string | symbol,
        parameterIndex: number
    ) {
        const existing =
            Reflect.getMetadata(PARAMS_METADATA_KEY, target, propertyKey) || {};

        existing[parameterIndex] = {
            type: "param",
            name,
            pipes,
        };

        Reflect.defineMetadata(
            PARAMS_METADATA_KEY,
            existing,
            target,
            propertyKey
        );
    };
}

export function Query(
    name?: string,
    ...pipes: (new () => Pipe)[]
) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        const existing =
            Reflect.getMetadata(PARAMS_METADATA_KEY, target, propertyKey) || {};

        existing[parameterIndex] = {
            type: "query",
            name,
            pipes,
        };

        Reflect.defineMetadata(PARAMS_METADATA_KEY, existing, target, propertyKey);
    };
}

export function Body(
    ...pipes: (Pipe | (new () => Pipe))[]
) {
    return function (
        target: any,
        propertyKey: string | symbol,
        parameterIndex: number
    ) {
        const existing =
            Reflect.getMetadata(PARAMS_METADATA_KEY, target, propertyKey) || {};

        existing[parameterIndex] = {
            type: "body",
            pipes,
        };

        Reflect.defineMetadata(
            PARAMS_METADATA_KEY,
            existing,
            target,
            propertyKey
        );
    };
}
import "reflect-metadata";

export const CONTROLLER_KEY = Symbol("controller");

export function Controller(prefix: string = "") {
    return function (target: any) {
        Reflect.defineMetadata(CONTROLLER_KEY, prefix, target);
    };
}
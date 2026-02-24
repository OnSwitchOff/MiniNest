import "reflect-metadata";
type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export const ROUTES_KEY = Symbol("routes");

export interface RouteDefinition {
    method: Method;
    path: string;
    handlerName: string;
}

export function Route(method: Method, path: string) {
    return function (
        target: any,
        propertyKey: string
    ) {
        const existingRoutes: RouteDefinition[] =
            Reflect.getMetadata(ROUTES_KEY, target.constructor) || [];

        existingRoutes.push({
            method: method,
            path,
            handlerName: propertyKey,
        });

        Reflect.defineMetadata(
            ROUTES_KEY,
            existingRoutes,
            target.constructor
        );
    };
}

export const Get = (p = '') => Route('get', p);
export const Post = (p = '') => Route('post', p);
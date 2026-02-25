import "reflect-metadata";

export type Token<T = any> = (new (...args: any[]) => T )| string | symbol;

export const INJECT_TOKENS_KEY = Symbol("inject_tokens");

export class Container {
    static instance = new Container();

    private registered = new Map<Token, any>();
    private singletons = new Map<Token, any>();

    register<T>(token: Token<T>, member: Token<T>) {
        console.log("Register token:", token);
        if (this.registered.has(token)) {
            throw new Error(`Token ${token.toString()} already registered`);
        }
        this.registered.set(token, member);
    }

    resolve<T>(token: Token<T>): T {

        console.log("Resolving token:", token);
        if (this.singletons.has(token)) {
            return this.singletons.get(token);
        }

        const target = this.registered.get(token);
        if (!target) {
            throw new Error(`Token ${token.toString()} is not registered`);
        }

        if (typeof target !== "function") {
            return target;
        }


        const paramTypes: any[] = Reflect.getMetadata("design:paramtypes", target) || [];
        console.log("Param types:", paramTypes);
        const injectTokens = Reflect.getMetadata(INJECT_TOKENS_KEY, target) || {};

        const deps = paramTypes.map((paramType, index) => {
            const overrideToken = injectTokens[index];
            const finalToken = overrideToken || paramType;

            if (finalToken === token) {
                throw new Error(`Circular dependency detected for token ${token.toString()}`);
            }

            return this.resolve(finalToken);
        });

        const instance = new target(...deps);
        this.singletons.set(token, instance);
        console.log("Created instance:", instance);
        return instance;
    }
}

export const container = Container.instance;
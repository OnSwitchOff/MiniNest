import { Provider } from "./provider";
import { Token } from "./token";

class Container {
    static instance = new Container();

    private providers = new Map<Token<any>, Provider<any>>();
    private instances = new Map<Token<any>, any>();

    register<T>(provider: Provider<T>) {
        this.providers.set(provider.token, provider);
    }

    resolve<T>(token: Token<T>): T {
        // If already instantiated, return instance
        if (this.instances.has(token)) {
            return this.instances.get(token);
        }

        const provider = this.providers.get(token);
        if (!provider) {
            throw new Error(`No provider found for token: ${token.toString()}`);
        }

        let instance: T;

        if (provider.useValue !== undefined) {
            instance = provider.useValue;
        } else if (provider.useFactory) {
            const deps = (provider.deps || []).map(dep => this.resolve(dep));
            instance = provider.useFactory(...deps);
        } else if (provider.useClass) {
            const paramTypes = Reflect.getMetadata("design:paramtypes", provider.useClass) || [];
            const deps = paramTypes.map((dep: any) => this.resolve(dep));
            instance = new provider.useClass(...deps);
        } else {
            throw new Error(`Provider for token ${token.toString()} is invalid`);
        }

        this.instances.set(token, instance);
        return instance;
    }
}

export const container = Container.instance;
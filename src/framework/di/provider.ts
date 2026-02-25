import {Token} from "./token";

export interface Provider<T = any> {
    token: Token<T>;
    useClass?: new (...args: any[]) => T;
    useValue?: T;
    useFactory?: (...args: any[]) => T;
    deps?: Token<any>[];
}
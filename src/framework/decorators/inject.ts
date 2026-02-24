import {INJECT_TOKENS_KEY, Token} from "../container";

export function Inject(token?: Token) {
    return function (target: any, _: any, parameterIndex: number) {
        const existing = Reflect.getMetadata(INJECT_TOKENS_KEY, target) || {};
        existing[parameterIndex] = token;
        Reflect.defineMetadata(INJECT_TOKENS_KEY, existing, target);
        const added = Reflect.getMetadata(INJECT_TOKENS_KEY, target) || {};
        console.log("Injected:",added);
    };
}
import {ExecutionContext} from "../../core/lifecycle/execution-context";
export interface CallHandler<T = any> {
    handle(): Promise<T>;
}
export interface Interceptor {
    intercept<T = any>(
        context: ExecutionContext,
        next: CallHandler<T>
    ): Promise<T>;
}
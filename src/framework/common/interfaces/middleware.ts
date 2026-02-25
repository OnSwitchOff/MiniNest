import {ExecutionContext} from "../../core/lifecycle/execution-context";
export interface Middleware {
    use(context: ExecutionContext, next: () => Promise<void>): Promise<void> | void;
}
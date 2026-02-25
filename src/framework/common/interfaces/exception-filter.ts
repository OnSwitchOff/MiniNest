import {ExecutionContext} from "../../core/lifecycle/execution-context";
export interface ExceptionFilter<T = unknown> {
    catch(exception: T, context: ExecutionContext): void | Promise<void>;
}
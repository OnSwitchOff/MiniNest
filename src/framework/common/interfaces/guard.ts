import {ExecutionContext} from "../../core/lifecycle/execution-context";

export interface Guard {
    canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
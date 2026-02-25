import {ExecutionContext} from "./execution-context";

export type NextFunction = () => Promise<any>;

export type ChainHandler = (
    context: ExecutionContext,
    next: NextFunction
) => Promise<any>;


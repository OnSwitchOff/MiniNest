export interface ExecutionContext {
    paramMetadata: Record<number, any>;
    handlerParamTypes: any[];
    req: any;
    res: any;
    controller: any;
    handlerName: string;
    args?: any[];
}
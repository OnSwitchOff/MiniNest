import {ExecutionContext} from "./execution-context";
import {ChainFactory, ChainFactoryCreateMetaData} from "./chain.factory";
import {NextFunction} from "./chain.types";
import {Pipe} from "../../common/interfaces/pipe";
import {Guard} from "../../common/interfaces/guard";
import {Interceptor} from "../../common/interfaces/interceptor";
import {Middleware} from "../../common/interfaces/middleware";
import {ExceptionFilter} from "../../common/interfaces/exception-filter";

export class RequestLifecycleEngine {
    private globalPipes: (new () => Pipe)[];
    private globalGuards: (new () => Guard)[];
    private globalInterceptors: (new () => Interceptor)[];
    private globalMiddlewares: (new () => Middleware)[];
    private globalExceptionFilters: (new () => ExceptionFilter)[];

    constructor(
        private readonly chainFactory: ChainFactory
    ) {}

    async run(
        context: ExecutionContext,
        metadata: ChainFactoryCreateMetaData,
        handler: () => Promise<any>
    ) {
        const executor: NextFunction = this.chainFactory.create(
            context,
            {
                ...metadata,
                pipes: [...this.globalPipes,...metadata.pipes],
                guards: [...this.globalGuards,...metadata.guards],
                interceptors: [...this.globalInterceptors,...metadata.interceptors],
                middlewares:[...this.globalMiddlewares,...metadata.middlewares],
                filters:[...this.globalExceptionFilters,...metadata.filters],
            },
            handler
        );

        return executor();
    }

    addGlobalPipes(...pipes:  (new () => Pipe)[]) {
        this.globalPipes.push(...pipes);
    }
    addGlobalGuards(...guards:  (new () => Guard)[]) {
        this.globalGuards.push(...guards);
    }
    addGlobalInterceptors(...interceptors:  (new () => Interceptor)[]) {
        this.globalInterceptors.push(...interceptors);        
    }
    addGlobalMiddlewares(...middlewares:  (new () => Middleware)[]) {
        this.globalMiddlewares.push(...middlewares);
    }
    addGlobalExceptionFilters(...exceptionFilters:  (new () => ExceptionFilter)[]) {
        this.globalExceptionFilters.push(...exceptionFilters);
    }
}
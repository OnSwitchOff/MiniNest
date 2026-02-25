import {RequestLifecycleEngine} from "./lifecycle/request-lifecycle.engine";
import {Interceptor} from "../common/interfaces/interceptor";
import {Middleware} from "../common/interfaces/middleware";
import {ExceptionFilter} from "../common/interfaces/exception-filter";
import {Pipe} from "../common/interfaces/pipe";
import {Guard} from "../common/interfaces/guard";
import {Express} from "express";

export class Application {

    constructor(
        private readonly expressApp: Express,
        private readonly container: any,
        private readonly lifecycleEngine: RequestLifecycleEngine
    ) {}

    async listen(port: number) {
        await this.expressApp.listen(port);
        console.log(`🚀 Server running on http://localhost:${port}`);
    }

    useGlobalPipes(...pipes: (new () => Pipe)[]) {
        this.lifecycleEngine.addGlobalPipes(...pipes);
    }

    useGlobalGuards(...guards: (new () => Guard)[]) {
        this.lifecycleEngine.addGlobalGuards(...guards);
    }

    useGlobalInterceptors(...interceptors: (new () => Interceptor)[]) {
        this.lifecycleEngine.addGlobalInterceptors(...interceptors);
    }

    useMiddleware(...middlewares: (new () => Middleware)[]) {
        this.lifecycleEngine.addGlobalMiddlewares(...middlewares);
    }

    useGlobalExceptionFilters(...exceptionFilters: (new () => ExceptionFilter)[]) {
        this.lifecycleEngine.addGlobalExceptionFilters(...exceptionFilters);
    }
}
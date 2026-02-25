import {ExecutionContext} from "./execution-context";
import {ChainHandler, NextFunction} from "./chain.types";
import {Guard} from "../../common/interfaces/guard";
import {Interceptor} from "../../common/interfaces/interceptor";
import {Middleware} from "../../common/interfaces/middleware";
import {Pipe} from "../../common/interfaces/pipe";
import {ExceptionFilter} from "../../common/interfaces/exception-filter";

export class ChainFactory {

    constructor(
        private readonly app: any
    ) {}

    create(
        context: ExecutionContext,
        metadata: {
            middlewares: (new () => Middleware)[];
            guards: (new () => Guard)[];
            pipes: (new () => Pipe)[];
            interceptors: (new () => Interceptor)[];
            filters: (new () => ExceptionFilter)[];
        },
        handler: ChainHandler
    ): NextFunction {

        const wrappedMiddlewares: ChainHandler[] = metadata.middlewares
            .map(m => this.wrapMiddleware(new m()));

        const wrappedGuards: ChainHandler[] = metadata.guards
            .map(g => this.wrapGuard(new g()));

        const wrappedInterceptors: ChainHandler[] = metadata.interceptors
            .map(i => this.wrapInterceptor(new i()));

        const wrappedPipes: ChainHandler[] = metadata.pipes
            .map(p => this.wrapPipe(new p()));

        const chain: ChainHandler[] = [...wrappedMiddlewares,...wrappedGuards,...wrappedInterceptors, ...wrappedPipes, handler];

        // ===== Compose chain =====
        const mainChain = this.compose(chain, context);

        const exceptionFilters = metadata.filters.map((f) => new f());

        return this.wrapWithExceptionFilter(context, mainChain, exceptionFilters);
    }

    private wrapGuard(guard: Guard): ChainHandler {
        return async (context, next) => {
            const canActivate = await guard.canActivate(context);
            if (!canActivate) {
                throw new Error("Forbidden");
            }
            return next();
        };
    }

    private wrapInterceptor(interceptor: Interceptor): ChainHandler {
        return async (context, next) => {
            return interceptor.intercept(context, {
                handle: next,
            });
        };
    }

    private wrapMiddleware(middleware: Middleware): ChainHandler {
        return async (context, next) => {
            return middleware.use(context, next);
        };
    }
    private wrapPipe(pipe: Pipe): ChainHandler {
        return async (context, next) => {
            // Extract initial args from request (all parameters)
            const paramTypes: any[] = context.handlerParamTypes || [];
            const paramMetadata: Record<number, any> = context.paramMetadata || {};
            const args: any[] = [];

            for (let i = 0; i < paramTypes.length; i++) {
                const meta = paramMetadata[i];

                let value: any = undefined;
                if (meta) {
                    switch (meta.type) {
                        case "param":
                            value = meta.name ? context.req.params[meta.name] : context.req.params;
                            break;
                        case "query":
                            value = meta.name ? context.req.query[meta.name] : context.req.query;
                            break;
                        case "body":
                            value = context.req.body;
                            break;
                        default:
                            value = undefined;
                    }
                }

                args[i] = value;
            }

            // Now apply the pipe to each argument
            for (let i = 0; i < args.length; i++) {
                args[i] = await pipe.transform(args[i], { index: i, type: "global" });
            }

            // Save transformed args into context for next in chain
            context.args = args;

            return next();
        };
    }

    private compose(
        handlers: ChainHandler[],
        context: ExecutionContext
    ): NextFunction {
        let index = -1;
        const dispatch = async (i: number): Promise<any> => {
            index = i;
            const handler = handlers[i];
            if (!handler) return;
            return handler(context, () => dispatch(i + 1));
        };
        return () => dispatch(0);
    }

    private wrapWithExceptionFilter(
        context: ExecutionContext,
        handler: NextFunction,
        filters: ExceptionFilter[]
    ): NextFunction {
        return async () => {
            try {
                // Run the original chain
                return await handler();
            } catch (err) {
                // Apply all filters in order
                for (const filter of filters) {
                    try {
                        return await filter.catch(err, context);
                    } catch (innerErr) {
                        // continue to next filter if it rethrows
                        err = innerErr;
                    }
                }
                // If no filter handled it, rethrow
                throw err;
            }
        };
    }
}



export class Application {

    constructor(
        private readonly httpAdapter: any,
        private readonly container: any,
        private readonly lifecycleEngine: any
    ) {}

    async listen(port: number) {
        await this.httpAdapter.listen(port);
        console.log(`🚀 Server running on http://localhost:${port}`);
    }

    useGlobalPipes(...pipes: any[]) {
        this.lifecycleEngine.addGlobalPipes(...pipes);
    }

    useGlobalGuards(...guards: any[]) {
        this.lifecycleEngine.addGlobalGuards(...guards);
    }

    useGlobalInterceptors(...interceptors: any[]) {
        this.lifecycleEngine.addGlobalInterceptors(...interceptors);
    }

    useMiddleware(...middlewares: any[]) {
        this.lifecycleEngine.addGlobalMiddlewares(...middlewares);
    }
}
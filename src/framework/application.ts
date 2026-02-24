import express, { Express } from "express";
import {CONTROLLER_KEY} from "./decorators/controller";
import {RouteDefinition, ROUTES_KEY} from "./decorators/routes";
import {container, INJECT_TOKENS_KEY} from "./container";
import {MODULE_METADATA_KEY} from "./decorators/module";
import {PARAMS_METADATA_KEY} from "./decorators/param";
import {Pipe, PIPES_METADATA_KEY} from "./decorators/use-pipe";

export class Application {
    private app: Express;
    private globalPipes: (new () => Pipe)[] = [];
    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

    public useGlobalPipes(...pipes: (new () => Pipe)[]) {
        this.globalPipes.push(...pipes);
    }

    public getExpressInstance(): Express {
        return this.app;
    }

    public async listen(port: number): Promise<void> {
        return new Promise((resolve) => {
            this.app.listen(port, () => {
                console.log(`Server started on http://localhost:${port}`);
                resolve();
            });
        });
    }

    public registerModule(moduleClass: any) {

        const metadata = Reflect.getMetadata(MODULE_METADATA_KEY, moduleClass);
        if (!metadata) {
            throw new Error(`${moduleClass.name} is not a module`);
        }

        const imports: any[] = metadata.imports || [];
        imports.forEach((importedModule) => {
            this.registerModule(importedModule);
        });

        this.registerControllers(metadata.controllers || []);
    }

    private registerControllers(controllers: any[]) {
        controllers.forEach((ControllerClass) => {

            // ===== Resolve constructor DI =====
            const paramTypes: any[] =
                Reflect.getMetadata("design:paramtypes", ControllerClass) || [];

            const injectTokens =
                Reflect.getMetadata(INJECT_TOKENS_KEY, ControllerClass) || {};

            const deps = paramTypes.map((paramType, index) => {
                const token = injectTokens[index] || paramType;
                return container.resolve(token);
            });

            const instance = new ControllerClass(...deps);

            const prefix: string =
                Reflect.getMetadata(CONTROLLER_KEY, ControllerClass) || "";

            const routes: RouteDefinition[] =
                Reflect.getMetadata(ROUTES_KEY, ControllerClass) || [];

            routes.forEach((route) => {

                const fullPath = `/${prefix}${route.path}`.replace(/\/+/g, "/");

                (this.app as any)[route.method](fullPath, async (req: any, res: any) => {
                    try {

                        const args: any[] = [];

                        // ===== PARAM metadata =====
                        const paramMetadata: Record<number, any> =
                            Reflect.getMetadata(
                                PARAMS_METADATA_KEY,
                                ControllerClass.prototype,
                                route.handlerName
                            ) || {};

                        // ===== PIPES metadata =====
                        const controllerPipesMeta =
                            Reflect.getMetadata(
                                PIPES_METADATA_KEY,
                                ControllerClass
                            ) || {};

                        const methodPipesMeta =
                            Reflect.getMetadata(
                                PIPES_METADATA_KEY,
                                ControllerClass.prototype,
                                route.handlerName
                            ) || {};

                        const controllerPipes =
                            controllerPipesMeta["_controller"] || [];

                        const methodPipes =
                            methodPipesMeta["_method"] || [];

                        const handlerParamTypes: any[] =
                            Reflect.getMetadata(
                                "design:paramtypes",
                                ControllerClass.prototype,
                                route.handlerName
                            ) || [];

                        const totalParams = handlerParamTypes.length;

                        for (let i = 0; i < totalParams; i++) {

                            const meta = paramMetadata[i];
                            let value: any = undefined;

                            // ===== Extract value =====
                            if (meta) {
                                switch (meta.type) {
                                    case "param":
                                        value = meta.name
                                            ? req.params[meta.name]
                                            : req.params;
                                        break;

                                    case "query":
                                        value = meta.name
                                            ? req.query[meta.name]
                                            : req.query;
                                        break;

                                    case "body":
                                        value = req.body;
                                        break;
                                }
                            }

                            // ===== Collect pipes in correct order =====
                            const paramPipes =
                                methodPipesMeta[i] || [];

                            const allPipes = [
                                ...(this.globalPipes || []),
                                ...controllerPipes,
                                ...methodPipes,
                                ...paramPipes,
                            ];

                            // ===== Apply pipes =====
                            for (const PipeClass of allPipes) {
                                const pipeInstance = new PipeClass();

                                value = pipeInstance.transform(value, {
                                    type: meta?.type,
                                    name: meta?.name,
                                    index: i,
                                });
                            }

                            args[i] = value;
                        }

                        const handler = instance[route.handlerName];

                        if (typeof handler !== "function") {
                            throw new Error(
                                `Handler ${route.handlerName} is not a function`
                            );
                        }

                        const result = await handler.call(instance, ...args);

                        res.send(result);

                    } catch (error: any) {
                        console.error("Route error:", error.message);
                        res.status(400).json({
                            statusCode: 400,
                            message: error.message,
                        });
                    }
                });

                console.log(`Mapped ${route.method.toUpperCase()} ${fullPath}`);
            });
        });
    }
}
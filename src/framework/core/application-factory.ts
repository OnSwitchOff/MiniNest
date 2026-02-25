import express from "express";
import {Application} from "./application";

export class ApplicationFactory {

    static async create(rootModule: any) {

        // 1️⃣ Create Express instance
        const expressInstance = express();
        expressInstance.use(express.json());

        // 2️⃣ Create DI container
        const container = new Container();

        // 3️⃣ Scan module tree
        const moduleScanner = new ModuleScanner(container);
        await moduleScanner.scan(rootModule);

        // 4️⃣ Create lifecycle engine
        const chainFactory = new ChainFactory();
        const lifecycleEngine = new RequestLifecycleEngine(chainFactory);

        // 5️⃣ Register controllers to router
        const routerExplorer = new RouterExplorer(
            expressInstance,
            container,
            lifecycleEngine
        );

        routerExplorer.explore();

        // 6️⃣ Return Application wrapper
        return new Application(
            expressInstance,
            container,
            lifecycleEngine
        );
    }
}
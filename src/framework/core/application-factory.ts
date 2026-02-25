import express from "express";
import {Application} from "./application";
import {container as IoContainer} from "../di/container";
import {ModuleScanner} from "./module-scanner";
import {ChainFactory} from "./lifecycle/chain.factory";
import {RequestLifecycleEngine} from "./lifecycle/request-lifecycle.engine";

export class ApplicationFactory {

    static async create(rootModule: any) {

        // 1️⃣ Create Express instance
        const expressInstance = express();
        expressInstance.use(express.json());

        // 2️⃣ DI container
        const container = IoContainer;

        // 3️⃣ Scan module tree and register controllers
        const moduleScanner = new ModuleScanner(expressInstance);
        await moduleScanner.scan(rootModule);

        // 4️⃣ Create lifecycle engine
        const chainFactory = new ChainFactory();
        const lifecycleEngine = new RequestLifecycleEngine(chainFactory);

        return new Application(
            expressInstance,
            container,
            lifecycleEngine
        );
    }
}
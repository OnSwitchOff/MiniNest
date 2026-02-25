import {ExecutionContext} from "./execution-context";
import {ChainFactory} from "./chain.factory";
import {NextFunction} from "./chain.types";

export class RequestLifecycleEngine {

    constructor(
        private readonly chainFactory: ChainFactory
    ) {}

    async run(
        context: ExecutionContext,
        metadata: any,
        handler: () => Promise<any>
    ) {
        const executor: NextFunction = this.chainFactory.create(
            context,
            metadata,
            handler
        );

        return executor();
    }
}
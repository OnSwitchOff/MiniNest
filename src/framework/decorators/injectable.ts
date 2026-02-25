import "reflect-metadata";
import {container} from "../container";
import {container as diContainer} from "../di/container";

export function Injectable() {
    return function (target: any) {
        console.log("Injectable:", target);
        container.register(target, target);
        diContainer.register({ token: target, useClass: target});
    };
}


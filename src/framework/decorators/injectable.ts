import "reflect-metadata";
import {container} from "../container";

export function Injectable() {
    return function (target: any) {
        console.log("Injectable:", target);
        container.register(target, target);
    };
}


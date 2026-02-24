import {Pipe} from "../../framework/decorators/use-pipe";

export class EmptyStringToUndefinedPipe implements Pipe<any, any> {
    transform(value: any) {

        if (value === "") {
            return undefined;
        }

        if (typeof value === "object" && value !== null) {
            const newObj: any = {};

            for (const key of Object.keys(value)) {
                const v = value[key];
                newObj[key] = v === "" ? undefined : v;
            }

            return newObj;
        }

        return value;
    }
}
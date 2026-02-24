import {Pipe} from "../../framework/decorators/use-pipe";

export class TrimPipe implements Pipe<any, any> {
    transform(value: any) {

        if (typeof value === "string") {
            return value.trim();
        }

        if (typeof value === "object" && value !== null) {
            const newObj: any = {};

            for (const key of Object.keys(value)) {
                const v = value[key];
                newObj[key] =
                    typeof v === "string" ? v.trim() : v;
            }

            return newObj;
        }

        return value;
    }
}


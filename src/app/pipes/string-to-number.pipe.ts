import {Pipe} from "../../framework/decorators/use-pipe";

export class StringToNumberPipe implements Pipe<string, number> {
    transform(value: string) {
        const num = Number(value);
        if (isNaN(num)) throw new Error(`Invalid value: ${value}`);
        return num;
    }
}
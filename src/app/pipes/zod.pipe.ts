import {ZodSchema} from 'zod';
import {Pipe} from "../../framework/decorators/use-pipe";

export class ZodValidationPipe implements Pipe<any, any> {
    constructor(
        private readonly schema: ZodSchema
    ) {}

    transform(value: unknown, meta: any) {
        try {
            return this.schema.parse(value);
        } catch (err) {
            throw new Error(
                `Validation failed for ${meta.type}`
            );
        }
    }
}


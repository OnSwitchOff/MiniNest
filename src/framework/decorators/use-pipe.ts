export interface Pipe<T = any, R = any> {
    transform(value: T, meta?: any): R;
}

export const PIPES_METADATA_KEY = Symbol("pipes_metadata");
export function UsePipe(...pipes: (new () => Pipe)[]) {
    return function (
        target: any,
        propertyKey?: string | symbol,
        parameterIndex?: number
    ) {
        // ===== PARAMETER LEVEL =====
        if (typeof parameterIndex === "number") {
            const existing =
                Reflect.getMetadata(
                    PIPES_METADATA_KEY,
                    target,
                    propertyKey!
                ) || {};

            existing[parameterIndex] = existing[parameterIndex] || [];
            existing[parameterIndex].push(...pipes);

            Reflect.defineMetadata(
                PIPES_METADATA_KEY,
                existing,
                target,
                propertyKey!
            );

            return;
        }

        // ===== METHOD LEVEL =====
        if (propertyKey) {
            const existing =
                Reflect.getMetadata(
                    PIPES_METADATA_KEY,
                    target,
                    propertyKey
                ) || {};

            existing["_method"] = existing["_method"] || [];
            existing["_method"].push(...pipes);

            Reflect.defineMetadata(
                PIPES_METADATA_KEY,
                existing,
                target,
                propertyKey
            );

            return;
        }

        // ===== CONTROLLER LEVEL =====
        const existing =
            Reflect.getMetadata(PIPES_METADATA_KEY, target) || {};

        existing["_controller"] = existing["_controller"] || [];
        existing["_controller"].push(...pipes);

        Reflect.defineMetadata(
            PIPES_METADATA_KEY,
            existing,
            target
        );
    };
}
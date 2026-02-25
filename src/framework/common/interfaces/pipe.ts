export interface Pipe<T = any, R = any> {
    transform(value: T, meta?: any): R;
}




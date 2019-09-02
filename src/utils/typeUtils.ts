export type Opaque<K, T> = T & { __TYPE__: K };

export type ValueOf<T> = T[keyof T];

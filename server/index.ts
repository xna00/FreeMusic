type FilterInner<K> = K extends `_${string}` ? never : K;

type FilterKey<T> = {
  [K in FilterInner<keyof T>]: T[K] extends (...args: never[]) => unknown
    ? T[K]
    : FilterKey<T[K]>;
};

import * as api from "./api/index.js";
export type Api = FilterKey<typeof api>;

import * as cst from "./constants/index.js";
export { cst };

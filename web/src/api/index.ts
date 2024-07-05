import type { Api } from "server";
export { cst } from "server";

const createHandler = (base: string): any => {
  return new Proxy(() => {}, {
    get(target, p, receiver) {
      if (p === "get") {
        const ret = createHandler(base);
        ret.method = "get";
        return ret;
      }
      return createHandler(`${base}/${p as string}`);
    },
    apply(target: any, thisArg, argArray) {
      return fetch(base, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(argArray),
      }).then((res) => {
        if (res.status === 401) {
          location.href = "/login";
        }
        if (
          res.headers.get("content-type")?.toLowerCase() === "application/json"
        ) {
          return res.json();
        }
        return res;
      });
    },
  });
};
type Promisify<T> = {
  [K in keyof T]: T[K] extends (...params: infer P) => infer R
    ? ((
        ...params: P
      ) => Promise<
        unknown extends Awaited<R> ? Response : Awaited<R>
      >) extends infer F
      ? F & {
          get: F;
        }
      : never
    : Promisify<T[K]>;
};

const api = createHandler("/api") as Promisify<Api>;
export { api };

export declare var self: ServiceWorkerGlobalScope;
import type { Api } from "../server/dist/index";

const CACHE_OLD = "AADD";
const CACHE = "FREE_MUSIC_V1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  caches.delete(CACHE_OLD);
});

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

const handler = async (e: FetchEvent) => {
  const url = new URL(e.request.url);
  const pathname = url.pathname;
  const cache = await caches.open(CACHE);
  const cachedRes = await cache.match(url);
  if (cachedRes) {
    return cachedRes;
  }
  if (pathname.startsWith("/audios/")) {
    const res = await api.source.getAudio(pathname.replace("/audios/", ""));
    if (res.ok) {
      const length = Number(res.headers.get("content-length") ?? "0");
      const newRes = new Response(res.body, {
        status: 200,
        headers: {
          "accept-ranges": "bytes",
          "content-length": length.toString(),
          "content-type": "application/octet-stream",
          range: `bytes=0-${length - 1}`,
        },
      });
      cache.put(url, newRes.clone());
      console.log("newRes", newRes, [...newRes.headers]);
      return newRes;
    } else {
      return res;
    }
  }
  if (pathname.startsWith("/images/")) {
    const res = await api.source.getImage(pathname.replace("/images/", ""));
    cache.put(url, res.clone());
    return res;
  }
  return fetch(e.request);
};

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const pathname = url.pathname;
  if (pathname.startsWith("/audios/") || pathname.startsWith("/images/")) {
    e.respondWith(handler(e));
  }
});
